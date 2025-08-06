// lib/wagmi.ts
import { http, createConfig } from "wagmi";
import { celoAlfajores, celo } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { walletConnect } from "@wagmi/connectors";

// WalletConnect project ID (you must generate one at https://cloud.walletconnect.com)
const WALLETCONNECT_PROJECT_ID = "your-project-id"; // 🔁 Replace this

export const config = createConfig({
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
  ],
  chains: [celoAlfajores, celo],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
  },
  ssr: true,
});
