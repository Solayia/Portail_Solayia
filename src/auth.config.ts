import type { NextAuthConfig } from "next-auth";

// Configuration "edge-safe" : pas d'accès base de données ici, pour pouvoir
// être importée par le middleware (qui tourne sur le runtime Edge).
// La logique d'authentification réelle (Prisma + bcrypt) vit dans `src/auth.ts`.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Contrôle d'accès global : tout le portail est privé sauf /login.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true; // page de login accessible aux visiteurs non connectés
      }

      return isLoggedIn; // tout le reste exige une session
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
      }
      return session;
    },
  },
  providers: [], // renseignés dans src/auth.ts
} satisfies NextAuthConfig;
