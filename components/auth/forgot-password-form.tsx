"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.email(),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();

  // Pending states
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // ===== Email / Password Login =====
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent");
    }

    setIsLoading(false);
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
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to reset your password
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
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </Button>
        </FieldGroup>
      </form>
    </Form>
  );
}
