// lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { celoAlfajores, celo } from "wagmi/chains";
import { walletConnect, injected } from "@wagmi/connectors";

export const WALLETCONNECT_PROJECT_ID = "357d7d5c4f534291a8e206a2eaef1f3c"; // 🔁 Replace this

export const config = createConfig({
  chains: [celoAlfajores, celo],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
  ],
  transports: {
    [celo.id]: http("https://forno.celo.org"),
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"),
  },
  ssr: true,
});
