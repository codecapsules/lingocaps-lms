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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { signInUser } from "@/server/users";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  const [isLoginEmailPending, startLoginEmailTransition] = useTransition();
  const [isLoginOTPPending, startLoginOTPTransition] = useTransition();
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();

  const [email, setEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ===== Login Email / Password =====
  async function onSubmit(values: z.infer<typeof formSchema>) {
    startLoginEmailTransition(async () => {
      const result = await signInUser(values.email, values.password);

      if (!result.success) {
        toast.error(result.message || "Invalid credentials");
        return;
      }

      toast.success("Login successful");
      router.push("/dashboard");
    });
  }

  // ===== Login OTP =====
  async function signInWithOTPEmail() {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    startLoginOTPTransition(async () => {
      try {
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Email sent successfully");
              router.push(`/verify-otp?email=${email}`);
            },
            onError: () => toast.error("Internal server error"),
          },
        });
      } catch {
        toast.error("Internal server error");
      }
    });
  }

  // ===== GitHub =====
  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => toast.success("Login with GitHub successful"),
          onError: () => toast.error("Internal server error"),
        },
      });
    });
  }

  // ===== Google =====
  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => toast.success("Login with Google successful"),
          onError: () => toast.error("Internal server error"),
        },
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-8", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {/* ===== Email / Password ===== */}
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and password to login
            </p>
          </div>

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-primary text-sm hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
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
              "Login"
            )}
          </Button>
        </FieldGroup>

        {/* ===== OTP & Social ===== */}
        <FieldGroup>
          <FieldSeparator>Or with One Time Password (OTP)</FieldSeparator>

          <Field>
            <Input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <Button
              disabled={isLoginOTPPending}
              type="button"
              onClick={signInWithOTPEmail}
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
              onClick={signInWithGithub}
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
              onClick={signInWithGoogle}
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
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
