"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // signIn lance une redirection en cas de succès : on la laisse remonter.
    if (error instanceof AuthError) {
      return "Email ou mot de passe incorrect.";
    }
    throw error;
  }
}
