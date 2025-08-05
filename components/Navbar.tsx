// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-[#f5f5f5] shadow-md text-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide text-green-700">
            EduFunds
          </h1>

          <div className="hidden md:flex space-x-6 text-sm font-semibold">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>
            <Link href="/parent" className="hover:text-green-600 transition">
              Parent
            </Link>
            <Link href="/student" className="hover:text-green-600 transition">
              Student
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700 text-xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-3 flex flex-col md:hidden space-y-3 font-medium px-2">
            <Link href="/" className="hover:text-green-600 transition">
              Home
            </Link>
            <Link href="/parent" className="hover:text-green-600 transition">
              Parent
            </Link>
            <Link href="/student" className="hover:text-green-600 transition">
              Student
            </Link>
          </div>
        )}
      </nav>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-20" />
    </>
  );
}

