import { requireAdmin } from "@/lib/auth-helpers";

// Garde-fou serveur : toute la section /admin est réservée aux ADMIN.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}
