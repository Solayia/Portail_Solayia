import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Le middleware n'utilise que la config edge-safe (pas de Prisma/bcrypt).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // On protège tout sauf les routes d'API, les assets Next et le favicon.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
