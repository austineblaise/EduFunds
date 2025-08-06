"use client";

import { useConnect } from "wagmi";
import { FaWallet, FaEthereum, FaBox } from "react-icons/fa";
import { SiWalletconnect } from "react-icons/si";

interface WalletModalProps {
  onClose: () => void;
}

const connectorIcons: Record<string, JSX.Element> = {
  MetaMask: <FaBox className="text-orange-500 text-2xl" />,
  WalletConnect: <SiWalletconnect className="text-blue-500 text-2xl" />,
  Injected: <FaEthereum className="text-purple-500 text-2xl" />,
};

export default function WalletModal({ onClose }: WalletModalProps) {
  const { connect, connectors, status } = useConnect();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg relative">
        <h2 className="text-lg font-bold text-center mb-4">🔌 Connect Wallet</h2>

        <div className="flex flex-col gap-4">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={!connector.ready || status === "pending"}
              className="flex items-center justify-between w-full border px-4 py-3 rounded hover:bg-gray-100 transition text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                {connectorIcons[connector.name] || <FaWallet />}
                {connector.name}
              </span>
              {status === "pending" && (
                <span className="text-xs text-gray-500">Connecting...</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
