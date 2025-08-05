"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import StipendManagerAbi from "@/lib/abis/StipendManager.json";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

const STIPEND_MANAGER_ADDRESS = "0xc31c5d51D3a1b234401A7F8f5804f85bb7877fcf";

type Stipend = {
  amount: number;
  unlockDate: number;
  withdrawn: boolean;
  category: string;
};

export default function StudentDashboard() {
  const { address, isConnected } = useAccount();
  const { connect, status } = useConnect();
  const { disconnect } = useDisconnect();

  const [stipends, setStipends] = useState<Stipend[]>([]);
  const [loading, setLoading] = useState(false);

  const getSigner = async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return await provider.getSigner();
  };

  const loadStipends = async () => {
    if (!address) return;
    const signer = await getSigner();
    const stipend = new ethers.Contract(
      STIPEND_MANAGER_ADDRESS,
      StipendManagerAbi.abi,
      signer
    );

    const data = await stipend.getMyStipends();

    setStipends(
      data.map((s: any) => ({
        amount: Number(ethers.formatEther(s.amount)),
        unlockDate: Number(s.unlockDate),
        withdrawn: s.withdrawn,
        category: s.category ?? "Unspecified",
      }))
    );
  };

  useEffect(() => {
    if (isConnected) loadStipends();
  }, [isConnected]);

  const handleWithdraw = async (index: number) => {
    const signer = await getSigner();
    const stipend = new ethers.Contract(
      STIPEND_MANAGER_ADDRESS,
      StipendManagerAbi.abi,
      signer
    );
    try {
      setLoading(true);
      const tx = await stipend.withdraw(index);
      await tx.wait();
      toast.success("Withdrawn!");
      await loadStipends();
    } catch (e) {
      console.error(e);
      toast.error("Withdraw failed");
    } finally {
      setLoading(false);
    }
  };

  const now = Math.floor(Date.now() / 1000);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-700">Student Dashboard</h2>
          {isConnected ? (
            <div className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
              <span className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-red-600 hover:underline"
              >
                Disconnect
              </button>
              <button
                onClick={loadStipends}
                className="text-blue-500 hover:underline ml-2"
              >
                Refresh
              </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              disabled={status === "pending"}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
            >
              {status === "pending" ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6 overflow-auto">
          <h3 className="text-lg font-semibold mb-4 text-black">Your Stipends</h3>
          {stipends.length === 0 ? (
            <p className="text-gray-500">No stipends assigned yet.</p>
          ) : (
            <table className="min-w-full text-sm text-black">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Amount (EDU)</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Unlocks</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {stipends.map((stipend, index) => {
                  const unlocked = stipend.unlockDate <= now && !stipend.withdrawn;
                  const unlockDateFormatted = formatDistanceToNow(
                    new Date(stipend.unlockDate * 1000),
                    { addSuffix: true }
                  );
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{stipend.amount}</td>
                      <td className="py-2 px-4">{stipend.category}</td>
                      <td className="py-2 px-4">{unlockDateFormatted}</td>
                      <td className="py-2 px-4">
                        {stipend.withdrawn
                          ? "Withdrawn"
                          : unlocked
                          ? "Available"
                          : "Locked"}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          disabled={!unlocked || loading}
                          onClick={() => handleWithdraw(index)}
                          className={`px-3 py-1 rounded text-white text-xs ${
                            unlocked
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Withdraw
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}


