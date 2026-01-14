// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

import prisma from "./prisma"; // PrismaClient classique
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import VerificationEmail from "@/components/emails/verification-email";
import { env } from "./env";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  // Database (Prisma)
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email + password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const { data, error } = await resend.emails.send({
        from: `${env.EMAIL_SENDER_NAME} <${env.EMAIL_SENDER_EMAIL}>`,
        to: [user.email],
        subject: "LingoCaps – Verification email",
        react: VerificationEmail({ userName: user.name, verificationUrl: url }),
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
  },

  // Social login
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID!,
      clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Plugins
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "LingoCaps <contact@mail.coachcapsules.com>",
          to: [email],
          subject: "LingoCaps – Verification code",
          html: `<p>Your verification code is:</p><h2>${otp}</h2>`,
        });
      },
    }),
    nextCookies(),
  ],
});
