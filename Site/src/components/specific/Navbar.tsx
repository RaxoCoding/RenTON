"use client";

import Link from "next/link";
import { LogIn, Wallet } from "lucide-react";
import { useTonAddress } from "@tonconnect/ui-react";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const userFriendlyAddress = useTonAddress();

  return (
    <nav className="bg-secondary text-secondary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-4">
            ReTON
          </Link>
        </div>
        <div className="md:flex items-center gap-4">
          {userFriendlyAddress ? (
            <div className="flex gap-2 w-full md:w-auto items-center">
              <Wallet className="mr-2 h-4 w-4" />
              {userFriendlyAddress}
            </div>
          ) : (
            <Button asChild className="w-full md:w-auto">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Login / Sign Up
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
