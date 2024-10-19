"use client";

import { useState, useEffect } from "react";
import { useAuthedUser } from "@/hooks/useAuthedUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { generateUsername } from "@/lib/utils";

export function RegisterModal() {
  const { authedUser, register, isRegistering, logout } = useAuthedUser();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(generateUsername());
  const [telegramHandle, setTelegramHandle] = useState("");

  useEffect(() => {
    if (authedUser && authedUser.id === "NULL") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [authedUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && telegramHandle) {
      register({
        username,
        telegramHandle,
        onSuccess: () => {
          setIsOpen(false);
          toast.success("Account created!");
        },
        onError: () => {
          toast.error("Account creation failed.");
        },
      });
    }
  };

  const handOpenChange = (open: boolean) => {
    if (
      open == false &&
      authedUser &&
      authedUser.id === "NULL" &&
      !isRegistering
    ) {
      logout();
      toast.error("Information is required!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handOpenChange}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Registration</DialogTitle>
          <DialogDescription>
            Please provide your Telegram handle and choose a username to
            complete your account setup.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
                placeholder="Enter your desired username"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telegramHandle" className="text-right">
                Telegram Handle
              </Label>
              <Input
                id="telegramHandle"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
                className="col-span-3"
                placeholder="@yourtelegramhandle"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isRegistering}>
              {isRegistering ? "Registering..." : "Complete Registration"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
