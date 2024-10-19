"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, Loader2, User, Package } from "lucide-react";
import Link from "next/link";
import { useAuthedUser } from "@/hooks/useAuthedUser";

export function WalletConnectButton() {
  const { authedUser, isLoading, login, logout } = useAuthedUser();

  const handleConnect = () => {
    login();
  };

  const handleDisconnect = () => {
    logout();
  };

  if (!authedUser) {
    return (
      <Button onClick={handleConnect} variant="default" size="sm">
        {!isLoading ? (
          <Wallet className="mr-2 h-4 w-4" />
        ) : (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild> 
        <Button variant="outline" size="sm">
          <Wallet className="mr-2 h-4 w-4" /> {authedUser.username}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={"/users/" + authedUser.username}>
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
        </Link>
        <Link href={"/inventory"}>
          <DropdownMenuItem className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" /> Inventory
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
