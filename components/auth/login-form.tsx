"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [githubPending, setGithubPending] = useTransition();
  const [googlePending, setGooglePending] = useTransition();
  const [emailPending, setEmailPending] = useTransition();
  const [email, setEmail] = useState("");

  async function signInWithGithub() {
    setGithubPending(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Success");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  async function signInWithGoogle() {
    setGooglePending(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Success");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  async function signInWithEmail() {
    setEmailPending(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent successfully");
            router.push(`/verify-otp?email=${email}`);
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        {/* <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </Field> */}
        <Field>
          <Button disabled={emailPending} onClick={signInWithEmail}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading ...</span>
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
        <Field>
          <Button
            disabled={githubPending}
            onClick={signInWithGithub}
            variant="outline"
            type="button"
          >
            {githubPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FaGithub className="size-4" />
            )}
            Login with GitHub
          </Button>
          <Button
            disabled={googlePending}
            onClick={signInWithGoogle}
            variant="outline"
            type="button"
          >
            {googlePending ? (
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
  );
}
