"use client";
import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function FBAuthPage() {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "改成你自己的",
      authDomain: "fir-demo-cc753.firebaseapp.com",
      projectId: "fir-demo-cc753",
      storageBucket: "fir-demo-cc753.appspot.com",
      messagingSenderId: "547407373138",
      appId: "1:547407373138:web:14b40e20e4b7fc773e108b",
      measurementId: "G-9S4KKT964F",
    };

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const authInstance = getAuth(app);
    authInstance.useDeviceLanguage();
    setAuth(authInstance);
  }, []);

  const signIn = () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.error("登入失敗：", error);
      });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-bold">Firebase 登入</h1>
      <p>{user ? `歡迎, ${user.displayName}` : "尚未登入"}</p>
      <button
        onClick={signIn}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        使用 Google 登入
      </button>
    </div>
  );
}
