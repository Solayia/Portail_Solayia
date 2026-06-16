import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@solayia.fr";
  const password = "Solayia2026!"; // ⚠️ à changer après la première connexion

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrateur Solayia",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Utilisateur admin prêt :", admin.email);
  console.log("   Mot de passe par défaut :", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
