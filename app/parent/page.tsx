// pages/parent/dashboard.tsx
"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function ParentDashboard() {
  const [student, setStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  const handleMint = () => {
    // TODO: Integrate with BlessingNGN mint function
    alert("Minted 1000 bNGN (mock)");
  };

  const handleAssign = () => {
    // TODO: Call stipend smart contract to assign stipend
    console.log({ student, amount, category, unlockDate });
    alert("Stipend assigned (mock)");
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Parent Dashboard</h2>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Mint BlessingNGN</h3>
          <button
            onClick={handleMint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Mint 1000 bNGN
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Assign Stipend to Student</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Student Wallet Address"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Amount (bNGN)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Category (e.g. books, transport)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            <button
              onClick={handleAssign}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Assign Stipend
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
