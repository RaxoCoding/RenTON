"use client";

import { NavBar } from "@/components/specific/Navbar";
import "@/styles/globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="dark">
        <TonConnectUIProvider
          manifestUrl={window.origin + "/tonconnect-manifest.json"}
        >
          <NavBar />
          <div className="p-5">{children}</div>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
