"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LogoutBtnProps {
  className?: string;
}

export default function LogoutBtn({ className }: LogoutBtnProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleSignOut() {
    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      toast.success("Logout successful");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      className={className}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Logging out...</span>
        </div>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
