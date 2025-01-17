'use client';
import AuthPage from "@/components/auth/AuthPage";
import Board from "@/components/Board";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Home() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUSerEmail] = useState<string | null>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
        setUSerEmail(user?.email);
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);
  

  return (
    isUserLoggedIn ? (
      <Board userEmail={userEmail} />
    ) : (
      <AuthPage />
    )
  )
}
