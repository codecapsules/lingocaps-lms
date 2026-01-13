// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";

import { resend } from "./resend";
import prisma from "./prisma"; // PrismaClient classique
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  // Database (Prisma)
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email + password
  emailAndPassword: {
    enabled: true,
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
