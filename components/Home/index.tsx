

// pages/index.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h1 className="text-4xl font-bold text-center text-green-700">
          Welcome to BlessingNGN
        </h1>
        <p className="text-center mt-4 text-gray-600 max-w-lg">
          A Celo-based app for managing student stipends with spending controls and savings logic.
        </p>

        <div className="mt-8 space-x-4">
          <Link
            href="/parent"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            I’m a Parent
          </Link>
          <Link
            href="/student"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            I’m a Student
          </Link>
        </div>
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
