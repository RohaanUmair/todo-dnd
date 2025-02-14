'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Board from "@/components/Board";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user?.email);
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isUserLoggedIn === false) {
      router.replace("/auth");
    }
  }, [isUserLoggedIn, router]);

  if (isUserLoggedIn == null) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-zinc-900 relative">
        <div className="flex bg-zinc-900 items-center pt-8 justify-center px-[10%] mx-auto relative">
          <h1
            data-testid="cypress-title"
            className="text-center text-white text-4xl font-semibold max-md:text-2xl"
          >
            TASK MANAGEMENT
          </h1>
        </div>
        <ClipLoader
          color="#fff"
          size={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4"
          speedMultiplier={2}
        />
      </div>
    );
  }

  if (!isUserLoggedIn) {
    return null;  
  }

  return <Board userEmail={userEmail} />;
}
