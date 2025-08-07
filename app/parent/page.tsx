"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import EduTokenAbi from "@/lib/abis/EduToken.json";
import StipendManagerAbi from "@/lib/abis/StipendManager.json";
import { toast } from "react-toastify";
import { switchToAlfajores } from "@/lib/connectWallet";
import { getWalletClient } from "wagmi/actions";
import { config } from "@/lib/wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const EDU_TOKEN_ADDRESS = "0x7E687dAD5c906EEF0915196A14Ebf1Ef0e1AdD3D";
const STIPEND_MANAGER_ADDRESS = "0xc31c5d51D3a1b234401A7F8f5804f85bb7877fcf";

export default function ParentDashboard() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [student, setStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [balance, setBalance] = useState("0");
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [loadingMint, setLoadingMint] = useState(false);

  // const getSigner = async () => {
  //   const provider = new ethers.BrowserProvider((window as any).ethereum);
  //   return await provider.getSigner();
  // };

  // const getSigner = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   return provider.getSigner();
  // };

  // const getSigner = async () => {
  //   const walletClient = await getWalletClient(config);
  //   if (!walletClient) throw new Error("No wallet client found");

  //   const provider = new ethers.providers.Web3Provider(walletClient.transport);
  //   return provider.getSigner();
  // };

  const getSigner = async () => {
    const walletClient = await getWalletClient(config);
    if (!walletClient) throw new Error("No wallet client found");

    const provider = new ethers.providers.Web3Provider(window.ethereum); // ✅ this is correct
    return provider.getSigner(walletClient.account.address); // pass in connected account
  };

  const fetchBalance = async () => {
    if (!address) return;
    try {
      const signer = await getSigner();
      const edu = new ethers.Contract(
        EDU_TOKEN_ADDRESS,
        EduTokenAbi.abi,
        signer
      );
      const bal = await edu.balanceOf(address);
      setBalance(ethers.utils.formatEther(bal));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  useEffect(() => {
    if (isConnected) fetchBalance();
  }, [isConnected]);

  const handleMint = async () => {
    if (!isConnected) return toast.info("Please connect wallet");
    try {
      setLoadingMint(true);
      const signer = await getSigner();
      const edu = new ethers.Contract(
        EDU_TOKEN_ADDRESS,
        EduTokenAbi.abi,
        signer
      );
      const tx = await edu.mint(address, ethers.utils.parseEther("1000"));
      await tx.wait();
      await fetchBalance();
      toast.success("✅ Minted 1000 EDU!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Mint failed.");
    } finally {
      setLoadingMint(false);
    }
  };

  const handleAssign = async () => {
    if (!isConnected) return toast.info("Please connect wallet");
    if (!ethers.utils.isAddress(student))
      return toast.error("Invalid student address");
    if (!amount || !category || !unlockDate)
      return toast.error("Fill all fields");

    try {
      setLoadingAssign(true);
      const signer = await getSigner();
      const edu = new ethers.Contract(
        EDU_TOKEN_ADDRESS,
        EduTokenAbi.abi,
        signer
      );
      const stipend = new ethers.Contract(
        STIPEND_MANAGER_ADDRESS,
        StipendManagerAbi.abi,
        signer
      );

      const amountWei = ethers.utils.parseEther(amount);
      // const unlock = Math.floor(new Date(unlockDate).getTime() / 1000);
      const unlock = Math.floor(new Date(unlockDate).getTime() / 1000);

      const approvalTx = await edu.approve(STIPEND_MANAGER_ADDRESS, amountWei);
      await approvalTx.wait();

      // ⛳ This now includes `category`
      const assignTx = await stipend.assignStipend(
        student,
        amountWei,
        unlock,
        category
      );
      await assignTx.wait();

      await fetchBalance();

      toast.success("✅ Stipend assigned!");
      setStudent("");
      setAmount("");
      setCategory("");
      setUnlockDate("");
    } catch (e) {
      console.error(e);
      toast.error("❌ Failed to assign stipend");
    } finally {
      setLoadingAssign(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6 text-sm text-gray-700">
          {!isConnected ? (
            <div className="flex justify-center">
              {/* <button
                onClick={() => connect({ connector: injected() })}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center"
              >
                Connect Wallet
              </button> */}

              {/* <button
                onClick={async () => {
                  await connect({ connector: injected() });
                  await switchToAlfajores();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Connect Wallet
              </button> */}

              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-white">
                  Wallet:{" "}
                  <span className="font-mono text-green-500">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </span>
                <button
                  onClick={() => disconnect()}
                  className="hover:underline text-sm bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded"
                >
                  Disconnect
                </button>
              </div>
              <div className="text-white">
                Balance:{" "}
                <span className="font-semibold text-green-500">
                  {balance} EDU
                </span>
              </div>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold bg-green-600 mb-8 text-center">
          🎓 Parent Dashboard
        </h1>

        <section className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-black">
            Mint EDU Token
          </h3>
          <button
            onClick={handleMint}
            disabled={loadingMint}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded transition disabled:opacity-60"
          >
            {loadingMint ? "Minting..." : "Mint 1000 EDU"}
          </button>
        </section>

        <section className="bg-white shadow-md rounded-xl p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">Assign Stipend</h2>

          <div className="grid gap-4">
            <div className="flex flex-col">
              <label htmlFor="student" className="mb-1 text-sm font-medium">
                Student Wallet Address
              </label>
              <input
                id="student"
                type="text"
                placeholder="0x123..."
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="amount" className="mb-1 text-sm font-medium">
                Amount (EDU)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="e.g. 50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="category" className="mb-1 text-sm font-medium">
                Category (e.g. books, transport)
              </label>
              <input
                id="category"
                type="text"
                placeholder="e.g. food, transport"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="unlockDate" className="mb-1 text-sm font-medium">
                Unlock Date & Time
              </label>
              <input
                id="unlockDate"
                type="datetime-local"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
              />
            </div>

            <button
              onClick={handleAssign}
              disabled={loadingAssign}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-60"
            >
              {loadingAssign ? "Assigning..." : "Assign Stipend"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
