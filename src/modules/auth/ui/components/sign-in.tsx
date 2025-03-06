"use client";

// External dependencies
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signIn } from "@/modules/auth/lib/auth-client";

// Internal dependencies - UI Components
import { toast } from "sonner";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SignIn() {
  const [loadingGithub, setLoadingGithub] = useState(false);

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div
          className={cn(
            "w-full gap-2 flex items-center mt-2",
            "justify-between flex-col"
          )}
        >
          <Button
            variant="outline"
            disabled={loadingGithub}
            className={cn("w-full gap-2")}
            onClick={async () => {
              await signIn.social({
                provider: "github",
                callbackURL: "/",
                fetchOptions: {
                  onResponse: () => {
                    setLoadingGithub(false);
                  },
                  onRequest: () => {
                    setLoadingGithub(true);
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                },
              });
            }}
          >
            {loadingGithub ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Github size={16} />
            )}
            Continue with Github
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
