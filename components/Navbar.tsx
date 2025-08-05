// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 shadow-md bg-white flex justify-between items-center">
      <h1 className="text-xl font-bold text-green-600">EduFunds</h1>
      <div className="space-x-4">
        <Link href="/" className="text-gray-600 hover:text-green-600">Home</Link>
        <Link href="/parent" className="text-gray-600 hover:text-green-600">Parent</Link>
        <Link href="/student" className="text-gray-600 hover:text-green-600">Student</Link>
      </div>
    </nav>
  );
}
