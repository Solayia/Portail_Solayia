"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export type ActionResult = { error?: string; success?: string };

const ADMIN_PATH = "/admin/users";

const roleSchema = z.nativeEnum(Role);

const createSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  email: z.string().trim().toLowerCase().email("Email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères."),
  role: roleSchema,
});

/** Empêche de retirer le dernier administrateur actif de la plateforme. */
async function wouldRemoveLastAdmin(targetUserId: string): Promise<boolean> {
  const activeAdmins = await prisma.user.findMany({
    where: { role: Role.ADMIN, active: true },
    select: { id: true },
  });
  return activeAdmins.length <= 1 && activeAdmins.some((a) => a.id === targetUserId);
}

/** Crée un nouvel utilisateur. */
export async function createUser(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un utilisateur avec cet email existe déjà." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath(ADMIN_PATH);
  return { success: `Utilisateur ${email} créé.` };
}

/** Change le rôle d'un utilisateur. */
export async function updateUserRole(
  userId: string,
  role: Role,
): Promise<ActionResult> {
  await requireAdmin();

  const parsedRole = roleSchema.safeParse(role);
  if (!parsedRole.success) return { error: "Rôle invalide." };

  if (parsedRole.data !== Role.ADMIN && (await wouldRemoveLastAdmin(userId))) {
    return { error: "Impossible : c'est le dernier administrateur." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsedRole.data },
  });

  revalidatePath(ADMIN_PATH);
  return { success: "Rôle mis à jour." };
}

/** Active ou désactive un compte. Un compte désactivé ne peut plus se connecter. */
export async function setUserActive(
  userId: string,
  active: boolean,
): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (!active && userId === admin.id) {
    return { error: "Vous ne pouvez pas désactiver votre propre compte." };
  }
  if (!active && (await wouldRemoveLastAdmin(userId))) {
    return { error: "Impossible : c'est le dernier administrateur." };
  }

  await prisma.user.update({ where: { id: userId }, data: { active } });

  revalidatePath(ADMIN_PATH);
  return { success: active ? "Compte activé." : "Compte désactivé." };
}

/** Réinitialise le mot de passe d'un utilisateur. */
export async function resetPassword(
  userId: string,
  newPassword: string,
): Promise<ActionResult> {
  await requireAdmin();

  if (newPassword.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { success: "Mot de passe réinitialisé." };
}

/** Supprime définitivement un utilisateur. */
export async function deleteUser(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { error: "Vous ne pouvez pas supprimer votre propre compte." };
  }
  if (await wouldRemoveLastAdmin(userId)) {
    return { error: "Impossible : c'est le dernier administrateur." };
  }

  await prisma.user.delete({ where: { id: userId } });

  revalidatePath(ADMIN_PATH);
  return { success: "Utilisateur supprimé." };
}
