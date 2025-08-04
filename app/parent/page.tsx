"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { ethers } from "ethers";
import EduTokenAbi from "@/lib/abis/EduToken.json";
import StipendManagerAbi from "@/lib/abis/StipendManager.json";

const EDU_TOKEN_ADDRESS = "0x32157FB543fa63F1bAA6fEe227937263Ee7F4a2D";
const STIPEND_MANAGER_ADDRESS = "0xD700131a3F4Ee483A9F7778E3a2aD583C182D6fE";

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

  const getSigner = async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return await provider.getSigner();
  };

  const fetchBalance = async () => {
    if (!address) return;
    try {
      const signer = await getSigner();
      const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
      const bal = await edu.balanceOf(address);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  useEffect(() => {
    if (isConnected) fetchBalance();
  }, [isConnected]);

  const handleMint = async () => {
    if (!isConnected) return alert("Please connect wallet");
    try {
      setLoadingMint(true);
      const signer = await getSigner();
      const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
      const tx = await edu.mint(address, ethers.parseEther("1000"));
      await tx.wait();
      await fetchBalance();
      alert("✅ Minted 1000 EDU!");
    } catch (err) {
      console.error(err);
      alert("❌ Mint failed.");
    } finally {
      setLoadingMint(false);
    }
  };

  const handleAssign = async () => {
    if (!isConnected) return alert("Please connect wallet");
    try {
      setLoadingAssign(true);
      const signer = await getSigner();
      const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
      const stipend = new ethers.Contract(
        STIPEND_MANAGER_ADDRESS,
        StipendManagerAbi.abi,
        signer
      );

      const amountWei = ethers.parseEther(amount);
      const unlock = Math.floor(new Date(unlockDate).getTime() / 1000);

      const approvalTx = await edu.approve(STIPEND_MANAGER_ADDRESS, amountWei);
      await approvalTx.wait();

      const assignTx = await stipend.assignStipend(student, amountWei, unlock);
      await assignTx.wait();

      await fetchBalance();

      alert("✅ Stipend assigned!");
      setStudent("");
      setAmount("");
      setCategory("");
      setUnlockDate("");
    } catch (e) {
      console.error(e);
      alert("❌ Failed to assign stipend");
    } finally {
      setLoadingAssign(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <h1 className="text-3xl font-bold text-gray-800 mb-8">🎓 Parent Dashboard</h1>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6 text-sm text-gray-700">
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span>
                  Wallet:{" "}
                  <span className="font-mono text-gray-800">
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
              <div>
                Balance:{" "}
                <span className="font-semibold text-green-700">{balance} EDU</span>
              </div>
            </div>
          )}
        </div>

       

        <section className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3 text-black">Mint EDU Token</h2>
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
            <input
              type="text"
              placeholder="Student Wallet Address"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
            <input
              type="number"
              placeholder="Amount (EDU)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
            <input
              type="text"
              placeholder="Category (e.g. books, transport)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
            />

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





// "use client";

// import Navbar from "@/components/Navbar";
// import { useState, useEffect } from "react";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { injected } from "wagmi/connectors";
// import { ethers } from "ethers";
// import EduTokenAbi from "@/lib/abis/EduToken.json";
// import StipendManagerAbi from "@/lib/abis/StipendManager.json";

// const EDU_TOKEN_ADDRESS = "0x32157FB543fa63F1bAA6fEe227937263Ee7F4a2D";
// const STIPEND_MANAGER_ADDRESS = "0xD700131a3F4Ee483A9F7778E3a2aD583C182D6fE";

// export default function ParentDashboard() {
//   const { address, isConnected } = useAccount();
//   const { connect } = useConnect();
//   const { disconnect } = useDisconnect();

//   const [student, setStudent] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [unlockDate, setUnlockDate] = useState("");
//   const [balance, setBalance] = useState("0");

//   const getSigner = async () => {
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     return await provider.getSigner();
//   };

//   const fetchBalance = async () => {
//     if (!address) return;
//     const signer = await getSigner();
//     const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
//     const bal = await edu.balanceOf(address);
//     setBalance(ethers.formatEther(bal));
//   };

//   useEffect(() => {
//     if (isConnected) {
//       fetchBalance();
//     }
//   }, [isConnected]);

//   const handleMint = async () => {
//     if (!isConnected) return alert("Please connect wallet");
//     try {
//       const signer = await getSigner();
//       const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
//       const tx = await edu.mint(address, ethers.parseEther("1000"));
//       await tx.wait();
//       await fetchBalance();
//       alert("Minted 1000 EDU!");
//     } catch (err) {
//       console.log(err);
//       alert("Mint failed.");
//     }
//   };

//   const handleAssign = async () => {
//     if (!isConnected) return alert("Please connect wallet");
//     try {
//       const signer = await getSigner();
//       const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
//       const stipend = new ethers.Contract(
//         STIPEND_MANAGER_ADDRESS,
//         StipendManagerAbi.abi,
//         signer
//       );

//       const amountWei = ethers.parseEther(amount);
//       const unlock = Math.floor(new Date(unlockDate).getTime() / 1000);

//       let tx = await edu.approve(STIPEND_MANAGER_ADDRESS, amountWei);
//       await tx.wait();

//       tx = await stipend.assignStipend(student, amountWei, unlock);
//       await tx.wait();

//       alert("Stipend assigned!");
//     } catch (e) {
//       console.error(e);
//       alert("Failed to assign stipend");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-3xl mx-auto px-4 py-8">
//         {!isConnected ? (
//           <button
//             onClick={() => connect({ connector: injected() })}
//             className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Connect Wallet
//           </button>
//         ) : (
//           <div className="mb-4 text-gray-600 text-sm">
//             Wallet:{" "}
//             <span className="font-mono bg-gray-100 px-2 py-1 rounded">
//               {address?.slice(0, 6)}...{address?.slice(-4)}
//             </span>
//             <button
//               onClick={() => disconnect()}
//               className="ml-2 text-red-600 hover:underline"
//             >
//               Disconnect
//             </button>
//             <div className="mt-2">
//               EDU Balance: <strong>{balance}</strong>
//             </div>
//           </div>
//         )}

//         <h2 className="text-2xl font-bold mb-6 text-green-700">Parent Dashboard</h2>

//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-2">Mint EDU Token</h3>
//           <button
//             onClick={handleMint}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Mint 1000 EDU
//           </button>
//         </div>

//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Assign Stipend to Student</h3>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Student Wallet Address"
//               value={student}
//               onChange={(e) => setStudent(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="number"
//               placeholder="Amount (EDU)"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="text"
//               placeholder="Category (e.g. books, transport)"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="date"
//               value={unlockDate}
//               onChange={(e) => setUnlockDate(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <button
//               onClick={handleAssign}
//               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             >
//               Assign Stipend
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }







// "use client";

// import Navbar from "@/components/Navbar";
// import { useState } from "react";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { injected } from "wagmi/connectors";
// import { ethers } from "ethers";
// import EduTokenAbi from "@/lib/abis/EduToken.json";
// import StipendManagerAbi from "@/lib/abis/StipendManager.json";

// const EDU_TOKEN_ADDRESS = "0x32157FB543fa63F1bAA6fEe227937263Ee7F4a2D";
// const STIPEND_MANAGER_ADDRESS = "0xD700131a3F4Ee483A9F7778E3a2aD583C182D6fE";

// // EduToken deployed to: 0x32157FB543fa63F1bAA6fEe227937263Ee7F4a2D
// // StipendManager deployed to: 0xD700131a3F4Ee483A9F7778E3a2aD583C182D6fE

// export default function ParentDashboard() {
//   const { address, isConnected } = useAccount();
//   const { connect } = useConnect();
//   const { disconnect } = useDisconnect();

//   const [student, setStudent] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [unlockDate, setUnlockDate] = useState("");

//   const getSigner = async () => {
//     const provider = new ethers.BrowserProvider((window as any).ethereum);
//     const signer = await provider.getSigner();
//     return signer;
//   };

//   const handleMint = async () => {
//     if (!isConnected) return alert("Please connect wallet");
//     try {
//       const signer = await getSigner();
//       const eduInterface = new ethers.Interface(EduTokenAbi.abi);
//       const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, eduInterface, signer);
//       const tx = await edu.mint(address, ethers.parseEther("1000"));
//       await tx.wait();
//       alert("Minted 1000 EDU!");
//     } catch (err) {
//       console.log(err);
//       alert("Mint failed.");
//     }
//   };

//   const handleAssign = async () => {
//     if (!isConnected) return alert("Please connect wallet");
//     try {
//       const signer = await getSigner();
//       const edu = new ethers.Contract(EDU_TOKEN_ADDRESS, EduTokenAbi.abi, signer);
//       const stipend = new ethers.Contract(
//         STIPEND_MANAGER_ADDRESS,
//         StipendManagerAbi.abi,
//         signer
//       );

//       const amountWei = ethers.parseEther(amount);
//       const unlock = Math.floor(new Date(unlockDate).getTime() / 1000);

//       let tx = await edu.approve(STIPEND_MANAGER_ADDRESS, amountWei);
//       await tx.wait();
//       tx = await stipend.assignStipend(student, amountWei, unlock);
//       await tx.wait();
//       alert("Stipend assigned!");
//     } catch (e) {
//       console.error(e);
//       alert("Failed to assign stipend");
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-3xl mx-auto px-4 py-8">
//         {!isConnected && (
//           <button
//             onClick={() => connect({ connector: injected() })}
//             className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Connect Wallet
//           </button>
//         )}

//         {isConnected && (
//           <p className="mb-4 text-gray-500 font-mono">
//             {address?.slice(0,6)}...{address?.slice(-4)}{" "}
//             <button className="text-red-500 ml-2" onClick={() => disconnect()}>
//               Disconnect
//             </button>
//           </p>
//         )}

//         <h2 className="text-2xl font-bold mb-6 text-green-700">Parent Dashboard</h2>

//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-2">Mint EDU Token</h3>
//           <button
//             onClick={handleMint}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Mint 1000 EDU
//           </button>
//         </div>

//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Assign Stipend to Student</h3>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Student Wallet Address"
//               value={student}
//               onChange={(e) => setStudent(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="number"
//               placeholder="Amount (EDU)"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="text"
//               placeholder="Category (e.g. books, transport)"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="date"
//               value={unlockDate}
//               onChange={(e) => setUnlockDate(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <button
//               onClick={handleAssign}
//               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             >
//               Assign Stipend
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }








// // pages/parent/dashboard.tsx
// "use client";
// import Navbar from "@/components/Navbar";
// import { useState } from "react";

// export default function ParentDashboard() {
//   const [student, setStudent] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [unlockDate, setUnlockDate] = useState("");

//   const handleMint = () => {
//     // TODO: Integrate with BlessingNGN mint function
//     alert("Minted 1000 bNGN (mock)");
//   };

//   const handleAssign = () => {
//     // TODO: Call stipend smart contract to assign stipend
//     console.log({ student, amount, category, unlockDate });
//     alert("Stipend assigned (mock)");
//   };

//   return (
//     <div>
//       <Navbar />
//       <main className="max-w-3xl mx-auto px-4 py-8">
//         <h2 className="text-2xl font-bold mb-6 text-green-700">Parent Dashboard</h2>

//         <div className="bg-white shadow rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-2">Mint BlessingNGN</h3>
//           <button
//             onClick={handleMint}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Mint 1000 bNGN
//           </button>
//         </div>

//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-semibold mb-4">Assign Stipend to Student</h3>
//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Student Wallet Address"
//               value={student}
//               onChange={(e) => setStudent(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="number"
//               placeholder="Amount (bNGN)"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="text"
//               placeholder="Category (e.g. books, transport)"
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />
//             <input
//               type="date"
//               value={unlockDate}
//               onChange={(e) => setUnlockDate(e.target.value)}
//               className="w-full border rounded px-3 py-2"
//             />

//             <button
//               onClick={handleAssign}
//               className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//             >
//               Assign Stipend
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
