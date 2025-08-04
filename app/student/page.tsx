"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import StipendManagerAbi from "@/lib/abis/StipendManager.json";
import { formatDistanceToNow } from "date-fns";

const STIPEND_MANAGER_ADDRESS = "0xD700131a3F4Ee483A9F7778E3a2aD583C182D6fE";

type Stipend = {
  amount: number;
  unlockDate: number;
  withdrawn: boolean;
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
      }))
    );
  };

  useEffect(() => {
    if (isConnected) {
      loadStipends();
    }
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
      alert("Withdrawn!");
      await loadStipends();
    } catch (e) {
      console.error(e);
      alert("Withdraw failed");
    } finally {
      setLoading(false);
    }
  };

  const now = Math.floor(Date.now() / 1000);

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Student Dashboard</h2>
          {isConnected ? (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="text-red-600 hover:underline ml-2"
              >
                Disconnect
              </button>
              <button
                onClick={loadStipends}
                className="ml-4 text-sm text-blue-500 hover:underline"
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

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Your Stipends</h3>
          {stipends.length === 0 ? (
            <p className="text-gray-500">No stipends assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {stipends.map((stipend, index) => {
                const unlocked = stipend.unlockDate <= now && !stipend.withdrawn;
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-4 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Stipend #{index + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        {stipend.amount} EDU{" "}
                        {!unlocked
                          ? `(unlocks ${formatDistanceToNow(
                              new Date(stipend.unlockDate * 1000),
                              { addSuffix: true }
                            )})`
                          : stipend.withdrawn
                          ? "(Withdrawn)"
                          : "(Available)"}
                      </p>
                    </div>
                    <button
                      disabled={!unlocked || loading}
                      onClick={() => handleWithdraw(index)}
                      className={`px-4 py-2 rounded text-white ${
                        unlocked
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Withdraw
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}







// "use client";

// import Navbar from "@/components/Navbar";
// import { useState, useEffect } from "react";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { injected } from "wagmi/connectors";
// import { ethers } from "ethers";
// import StipendManagerAbi from "@/lib/abis/StipendManager.json";

// const STIPEND_MANAGER_ADDRESS = "0xD700131a3F4Ee483A9F7778E3a2aD583C182D6fE";

// type Stipend = {
//   amount: number;
//   unlockDate: number;
//   withdrawn: boolean;
// };

// export default function StudentDashboard() {
//   const { address, isConnected } = useAccount();
//   const { connect, status } = useConnect();
//   const { disconnect } = useDisconnect();

//   const [stipends, setStipends] = useState<Stipend[]>([]);
//   const [loading, setLoading] = useState(false);

//   const getSigner = async () => {
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     return await provider.getSigner();
//   };

//   const loadStipends = async () => {
//     if (!address) return;
//     const signer = await getSigner();
//     const stipend = new ethers.Contract(
//       STIPEND_MANAGER_ADDRESS,
//       new ethers.Interface(StipendManagerAbi.abi),
//       signer
//     );
//     const data = await stipend.getMyStipends();
//     setStipends(
//       data.map((s: any) => ({
//         amount: Number(ethers.formatEther(s.amount)),
//         unlockDate: Number(s.unlockDate),
//         withdrawn: s.withdrawn,
//       }))
//     );
//   };

//   useEffect(() => {
//     if (address) {
//       loadStipends();
//     }
//   }, [address]);

//   const handleWithdraw = async (index: number) => {
//     const signer = await getSigner();
//     const stipend = new ethers.Contract(
//       STIPEND_MANAGER_ADDRESS,
//       StipendManagerAbi.abi,
//       signer
//     );
//     try {
//       setLoading(true);
//       const tx = await stipend.withdraw(index);
//       await tx.wait();
//       alert("Withdrawn!");
//       await loadStipends();
//     } catch (e) {
//       console.error(e);
//       alert("Withdraw failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const now = Date.now() / 1000;

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-3xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-blue-700">Student Dashboard</h2>
//           {isConnected ? (
//             <div className="text-sm text-gray-600 flex items-center gap-2">
//               <span className="font-mono">
//                 {address?.slice(0,6)}...{address?.slice(-4)}
//               </span>
//               <button
//                 onClick={() => disconnect()}
//                 className="text-red-600 hover:underline ml-2"
//               >
//                 Disconnect
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => connect({ connector: injected() })}
//               disabled={status === "pending"}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
//             >
//               {status === "pending" ? "Connecting..." : "Connect Wallet"}
//             </button>
//           )}
//         </div>

//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Your Stipends</h3>
//           {stipends.length === 0 ? (
//             <p className="text-gray-500">No stipends assigned yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {stipends.map((stipend, index) => {
//                 const unlocked = stipend.unlockDate <= now && !stipend.withdrawn;
//                 return (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center border p-4 rounded-md"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">
//                         Stipend #{index + 1}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {stipend.amount} EDU{" "}
//                         {!unlocked
//                           ? ` (unlocks on ${new Date(
//                               stipend.unlockDate * 1000
//                             ).toLocaleDateString()})`
//                           : "(Available)"}
//                       </p>
//                     </div>
//                     <button
//                       disabled={!unlocked || loading}
//                       onClick={() => handleWithdraw(index)}
//                       className={`px-4 py-2 rounded text-white ${
//                         unlocked
//                           ? "bg-blue-600 hover:bg-blue-700"
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                     >
//                       Withdraw
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }








// // app/student/dashboard.tsx
// "use client";

// import { useAccount, useConnect, useDisconnect, Connector } from "wagmi";
// import { injected } from "wagmi/connectors";
// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";

// type Stipend = {
//   category: string;
//   amount: number;
//   unlocked: boolean;
//   unlockDate?: string;
// };

// export default function StudentDashboard() {
//   const { address, isConnected } = useAccount();
//   const { connect, connectors, status, error } = useConnect();
//   const { disconnect } = useDisconnect();

//   const [stipends, setStipends] = useState<Stipend[]>([]);
//   const [today] = useState(new Date());

//   useEffect(() => {
//     const mockStipends: Stipend[] = [
//       { category: "Books", amount: 500, unlocked: true },
//       { category: "Transport", amount: 300, unlocked: true },
//       {
//         category: "Snacks",
//         amount: 200,
//         unlocked: false,
//         unlockDate: "2025-07-10",
//       },
//       {
//         category: "Tuition",
//         amount: 2000,
//         unlocked: false,
//         unlockDate: "2025-07-15",
//       },
//       { category: "Internet", amount: 150, unlocked: true },
//       {
//         category: "Accommodation",
//         amount: 1000,
//         unlocked: false,
//         unlockDate: "2025-07-20",
//       },
//     ];
//     setStipends(mockStipends);
//   }, []);

//   const handleWithdraw = async (category: string) => {
//     if (!isConnected || !address) {
//       alert("Please connect your wallet first.");
//       return;
//     }

//     // Replace with real smart contract write logic
//     alert(`Simulating withdraw for ${category} to ${address}`);
//   };

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-3xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-blue-700">Student Dashboard</h2>

//           {isConnected ? (
//             <div className="text-sm text-gray-600 flex items-center gap-2">
//               <span>
//                 Wallet:{" "}
//                 <span className="font-mono bg-gray-100 px-2 py-1 rounded">
//                   {address?.slice(0, 6)}...{address?.slice(-4)}
//                 </span>
//               </span>
//               <button
//                 onClick={() => disconnect()}
//                 className="text-red-600 hover:underline ml-2"
//               >
//                 Disconnect
//               </button>
//             </div>
//           ) : (
//             <button
//             onClick={() => connect({ connector: injected() })}

//             disabled={status === "pending"}
//             className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
//           >
//             {status === "pending" ? "Connecting..." : "Connect Wallet"}
//           </button>
          
//           )}
//         </div>

//         {/* Stipend Breakdown */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Your Stipends</h3>

//           {stipends.length === 0 ? (
//             <p className="text-gray-500">No stipends assigned yet.</p>
//           ) : (
//             <div className="space-y-4">
//               {stipends.map((stipend, index) => {
//                 const unlockDate = stipend.unlockDate
//                   ? new Date(stipend.unlockDate)
//                   : null;
//                 const nowUnlocked = unlockDate && today >= unlockDate;

//                 return (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: index * 0.1 }}
//                     className="flex justify-between items-center border p-4 rounded-md"
//                   >
//                     <div>
//                       <p className="font-medium text-gray-800">{stipend.category}</p>
//                       <p className="text-sm text-gray-500">
//                         ₦{stipend.amount} bNGN{" "}
//                         {!stipend.unlocked && !nowUnlocked
//                           ? `(Unlocks on ${stipend.unlockDate})`
//                           : "(Available)"}
//                       </p>
//                     </div>
//                     <button
//                       disabled={!stipend.unlocked && !nowUnlocked}
//                       onClick={() => handleWithdraw(stipend.category)}
//                       className={`px-4 py-2 rounded text-white ${
//                         stipend.unlocked || nowUnlocked
//                           ? "bg-blue-600 hover:bg-blue-700"
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                     >
//                       Withdraw
//                     </button>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
