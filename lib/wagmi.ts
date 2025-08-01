// lib/wagmi.ts
import { http, createConfig } from "wagmi";
import { celoAlfajores, celo } from "wagmi/chains"; // you can also import just `celoAlfajores` for testnet
import { injected } from "wagmi/connectors";

export const config = createConfig({
  connectors: [injected()],
  chains: [celoAlfajores, celo], // Testnet + Mainnet
  transports: {
    [celo.id]: http("https://forno.celo.org"), // Celo Mainnet RPC
    [celoAlfajores.id]: http("https://alfajores-forno.celo-testnet.org"), // Celo Testnet RPC
  },
  ssr: true,
});
