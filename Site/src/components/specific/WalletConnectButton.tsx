"use client";

import { useIsConnectionRestored } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, LogOut, Loader2, User, Package } from "lucide-react";
import Link from "next/link";

// Helper function to format the wallet address
const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export function WalletConnectButton() {
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const connectionRestored = useIsConnectionRestored();

  useEffect(() => {
    const fetchWalletInfo = async () => {
      setWalletAddress(
        tonConnectUI?.account?.address.replace(":", "x") || null
      );
    };

    fetchWalletInfo();
    const unsubscribe = tonConnectUI.onStatusChange(fetchWalletInfo);

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  const handleConnect = () => {
    tonConnectUI.openModal();
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    setWalletAddress(null);
  };

  if (!walletAddress) {
    return (
      <Button onClick={handleConnect} variant="outline" size="sm">
        {connectionRestored ? (
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
          <Wallet className="mr-2 h-4 w-4" /> {formatAddress(walletAddress)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={"/users/" + walletAddress}>
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
