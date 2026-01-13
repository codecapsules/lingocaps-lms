"use server";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

/**
 * Sign in with email/password
 */
export const signInUser = async (email: string, password: string) => {
  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return {
        success: false,
        message: errorBody?.message || "Invalid email or password",
      };
    }

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("signInUser error:", error);
    return { success: false, message: "Internal server error" };
  }
};

/**
 * Sign up a new user
 */
export const signUpUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: true,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return {
        success: false,
        message: errorBody?.message || "Failed to sign up",
      };
    }

    return { success: true, message: "User signed up successfully" };
  } catch (error) {
    console.error("signUpUser error:", error);
    return { success: false, message: "Internal server error" };
  }
};

/**
 * Send OTP to email
 */
export const sendOtpEmail = async (email: string) => {
  if (!email) return { success: false, message: "Email is required" };

  try {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
      fetchOptions: {
        onSuccess: () => true,
        onError: () => false,
      },
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("sendOtpEmail error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
};
