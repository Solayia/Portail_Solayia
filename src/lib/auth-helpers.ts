import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";

/** Récupère la session ou redirige vers /login. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

/** Exige le rôle ADMIN, sinon redirige vers le dashboard. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== Role.ADMIN) redirect("/dashboard");
  return user;
}
