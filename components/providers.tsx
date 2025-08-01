"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";
import { WagmiProvider } from "wagmi";
import { UserProvider } from "@/contexts/user-context";
import dynamic from "next/dynamic";
import { config } from "@/lib/wagmi";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <ErudaProvider>
        <MiniAppProvider addMiniAppOnLoad={true}>
          <UserProvider autoSignIn={true}>{children}</UserProvider>
        </MiniAppProvider>
      </ErudaProvider>
    </WagmiProvider>
  );
}
