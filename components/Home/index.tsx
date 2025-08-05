// pages/index.tsx
"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
          Welcome to EduFunds
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl">
  A Celo-powered platform for managing student stipends — with smart spending controls, automated savings, real-time withdrawal tracking, and transparent fund allocation between parents and students.
</p>


        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/parent"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition duration-200 w-48 text-center"
          >
            I’m a Parent
          </Link>
          <Link
            href="/student"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold shadow-lg transition duration-200 w-48 text-center"
          >
            I’m a Student
          </Link>
        </div>

        <footer className="mt-16 text-sm text-gray-500">
          Built on <span className="text-green-400 font-medium">Celo Blockchain</span>
        </footer>
      </main>
    </div>
  );
}




// "use client";

// import { useUser } from "@/contexts/user-context";
// import Image from "next/image";
// import { useAccount } from "wagmi";

// export default function Home() {
//   const { user, isLoading, error, signIn } = useUser();

//   const { address } = useAccount();

//   return (
//     <div className="bg-white text-black flex min-h-screen flex-col items-center justify-center p-4">
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold">Welcome</h1>
//         <p className="text-lg text-muted-foreground">
//           {user?.data ? "You are signed in!" : "Sign in to get started"}
//         </p>
//         <p className="text-lg text-muted-foreground">
//           {address
//             ? `${address.substring(0, 6)}...${address.substring(
//                 address.length - 4
//               )}`
//             : "No address found"}
//         </p>

//         {!user?.data ? (
//           <button
//             onClick={signIn}
//             disabled={isLoading}
//             className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 min-w-[160px] min-h-[48px]"
//           >
//             {isLoading ? (
//               <>
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
//                 <span>Signing in...</span>
//               </>
//             ) : (
//               "Sign in"
//             )}
//           </button>
//         ) : (
//           <div className="space-y-4">
//             {user && (
//               <div className="flex flex-col items-center space-y-2 min-h-[160px] justify-center">
//                 {user.isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
//                   </div>
//                 ) : (
//                   <>
//                     <Image
//                       src={user.data.pfp_url!}
//                       alt="Profile"
//                       className="w-20 h-20 rounded-full"
//                       width={80}
//                       height={80}
//                     />
//                     <div className="text-center">
//                       <p className="font-semibold">{user.data.display_name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         @{user.data.username}
//                       </p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
