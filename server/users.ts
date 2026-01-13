"use server";

import { auth } from "@/lib/auth";

export const signInUser = async (email: string, password: string) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    // ❌ Mauvais identifiants ou erreur auth
    if (!response.ok) {
      let message = "Invalid email or password";

      try {
        const errorBody = await response.json();
        if (typeof errorBody?.message === "string") {
          message = errorBody.message;
        }
      } catch {
        // ignore JSON parse error
      }

      return {
        success: false as const,
        message,
      };
    }

    // ✅ Session créée avec succès
    return {
      success: true as const,
      message: "User signed in successfully",
    };
  } catch (error) {
    console.error("[signInUser]", error);

    return {
      success: false as const,
      message: "Internal server error",
    };
  }
};

export const signUpUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      success: true as const,
      message: "User signed up successfully",
    };
  } catch (error) {
    console.error("[signUpUser]", error);

    return {
      success: false as const,
      message: "Internal server error",
    };
  }
};
