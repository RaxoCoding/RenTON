"use client";

import { NavBar } from "@/components/specific/Navbar";
import "@/styles/globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <TonConnectUIProvider
          manifestUrl={"https://renton-kappa.vercel.app/tonconnect-manifest.json"}
        >
          <TooltipProvider>
            <NavBar />
            <div className="p-5">{children}</div>
          </TooltipProvider>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
