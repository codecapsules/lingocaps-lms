"use server";

import { authClient } from "@/lib/auth-client";

/**
 * Sign in via GitHub
 */
export const signInWithGithub = async () => {
  try {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => true,
        onError: () => false,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("signInWithGithub error:", error);
    return { success: false, message: "Login with GitHub failed" };
  }
};

/**
 * Sign in via Google
 */
export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => true,
        onError: () => false,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("signInWithGoogle error:", error);
    return { success: false, message: "Login with Google failed" };
  }
};
