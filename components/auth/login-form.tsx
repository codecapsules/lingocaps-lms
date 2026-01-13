"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { signInUser, sendOtpEmail } from "@/server/users";
import { signInWithGithub, signInWithGoogle } from "@/server/social-users";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // Pending states
  const [isLoginEmailPending, startLoginEmailTransition] = useTransition();
  const [isLoginOTPPending, startLoginOTPTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  // ===== Email / Password Login =====
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    startLoginEmailTransition(async () => {
      const result = await signInUser(values.email, values.password);
      if (result.success) {
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    });
  };

  // ===== OTP Login =====
  const handleOtpLogin = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    startLoginOTPTransition(async () => {
      const result = await sendOtpEmail(email);
      if (result.success) {
        toast.success(result.message);
        router.push(`/verify-otp?email=${email}`);
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    });
  };

  // ===== Social Logins =====
  const handleGithubLogin = async () => {
    startGithubTransition(async () => {
      const result = await signInWithGithub();
      if (result.success) return;
      toast.error(result.message || "Login with GitHub failed");
    });
  };

  const handleGoogleLogin = async () => {
    startGoogleTransition(async () => {
      const result = await signInWithGoogle();
      if (result.success) return;
      toast.error(result.message || "Login with Google failed");
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-8", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {/* ===== SECTION 1 : Email / Password ===== */}
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and password to login
            </p>
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmail(e.target.value);
                    }}
                  />
                </FormControl>
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
                <div className="flex justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    className="text-primary text-sm hover:underline"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoginEmailPending} type="submit">
            {isLoginEmailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </Button>
        </FieldGroup>

        {/* ===== SECTION 2 : OTP / Social ===== */}
        <FieldGroup>
          <FieldSeparator>Or with One Time Password (OTP)</FieldSeparator>

          <Field>
            <Input
              id="otp-email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button
              disabled={isLoginOTPPending}
              type="button"
              onClick={handleOtpLogin}
            >
              {isLoginOTPPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Continue with Email</span>
                </>
              )}
            </Button>
          </Field>

          <FieldSeparator>Or continue with</FieldSeparator>

          <Field className="flex flex-col gap-2">
            <Button
              disabled={isGithubPending}
              onClick={handleGithubLogin}
              variant="outline"
              type="button"
            >
              {isGithubPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FaGithub className="size-4" />
              )}
              Login with GitHub
            </Button>

            <Button
              disabled={isGooglePending}
              onClick={handleGoogleLogin}
              variant="outline"
              type="button"
            >
              {isGooglePending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FcGoogle className="size-4" />
              )}
              Login with Google
            </Button>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="hover:text-primary underline underline-offset-4"
              >
                Register
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
