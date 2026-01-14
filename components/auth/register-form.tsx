"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  PasswordInput,
  PasswordInputStrengthChecker,
} from "../ui/password-input";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpUser } from "@/server/users";

const signUpFormSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function RegisterForm({ className }: { className?: string }) {
  const [registerPending, startRegisterPending] = useTransition();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ===== Register avec name/email/password =====
  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    startRegisterPending(async () => {
      try {
        const result = await signUpUser(
          values.name,
          values.email,
          values.password
        );

        if (result.success) {
          toast.success("Email verification sent, please check your email");
        } else {
          toast.error(result.message || "Invalid credentials");
        }
      } catch (error: unknown) {
        const e = error as Error;
        toast.error(e.message || "Internal server error");
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the form below to create your account
          </p>
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" {...field} />
              </FormControl>
              <FormDescription>We’ll use this to contact you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field}>
                  <PasswordInputStrengthChecker />
                </PasswordInput>
              </FormControl>
              <FormDescription>Must be at least 6 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={registerPending}>
          {registerPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Register"
          )}
        </Button>

        <div className="text-center text-sm mt-2">
          Already have an account? <Link href="/login">Login</Link>
        </div>
      </form>
    </Form>
  );
}
