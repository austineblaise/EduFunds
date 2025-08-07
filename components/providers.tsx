"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { MiniAppProvider } from "@/contexts/miniapp-context";
import { UserProvider } from "@/contexts/user-context";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} modalSize="compact">
          <ErudaProvider>
            <MiniAppProvider addMiniAppOnLoad>
              <UserProvider autoSignIn>{children}</UserProvider>
            </MiniAppProvider>
          </ErudaProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
