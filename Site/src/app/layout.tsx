"use client";

import { NavBar } from "@/components/specific/Navbar";
import "@/styles/globals.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <script src="https://telegram.org/js/telegram-web-app.js" async />
      <body className="dark">
        <TonConnectUIProvider
          manifestUrl={
            "https://renton-kappa.vercel.app/tonconnect-manifest.json"
          }
          actionsConfiguration={{
            returnStrategy: "back",
          }}
        >
          <ReactQueryProvider>
            <NavBar />
            <div className="p-5">{children}</div>
          </ReactQueryProvider>
        </TonConnectUIProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
