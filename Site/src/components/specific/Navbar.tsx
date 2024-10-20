"use client";

import Link from "next/link";
import { WalletConnectButton } from "./WalletConnectButton";

export function NavBar() {
  return (
    <nav className="bg-secondary text-secondary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-4">
            RenTON
          </Link>
        </div>
        <div className="md:flex items-center gap-4">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}
