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
          manifestUrl="http://localhost:3000/tonconnect-manifest.json"
          actionsConfiguration={{
            returnStrategy: "https://localhost:3000/",
          }}
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
