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
import { Wallet, LogOut, Loader2 } from "lucide-react";

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
      setWalletAddress(tonConnectUI?.account?.address || null);
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
        <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
