'use client';
import AuthPage from "@/components/auth/AuthPage";
import Board from "@/components/Board";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUSerEmail] = useState<string | null>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUSerEmail(user?.email);
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isUserLoggedIn == null) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-zinc-900 relative">
        <div className='flex bg-zinc-900 items-center pt-8 justify-center px-[10%] mx-auto relative'>
          <h1 data-testid='cypress-title' className='text-center text-white text-4xl font-semibold max-md:text-2xl'>TASK MANAGEMENT</h1>
        </div>
        <ClipLoader color="#fff" size={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4" speedMultiplier={2} />
      </div>
    )
  }

  return (
    isUserLoggedIn ? (
      <Board userEmail={userEmail} />
    ) : (
      <div className="h-screen w-screen overflow-hidden bg-zinc-900">
        <div className='flex bg-zinc-900 items-center pt-8 justify-center px-[10%] mx-auto relative'>
          <h1 className='text-center text-white text-4xl font-semibold max-md:text-2xl'>TASK MANAGEMENT</h1>
        </div>
        <AuthPage />
      </div>
    )
  )
}
