// google 登入範例程式碼
// 別忘記到 auth 頁面新增服務提供商

"use client";
import { initializeApp, getApps } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

export default function FBAuth() {
  const firebaseConfig = {
    apiKey: "改成你自己的",
    authDomain: "fir-demo-cc753.firebaseapp.com",
    databaseURL: "改成你自己的",
    projectId: "fir-demo-cc753",
    storageBucket: "fir-demo-cc753.firebasestorage.app",
    messagingSenderId: "547407373138",
    appId: "1:547407373138:web:14b40e20e4b7fc773e108b",
    measurementId: "G-9S4KKT964F"
  };

  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // 延後初始化，避免 build 時報錯
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
        console.error(error);
      });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">FB Auth</h1>
      <h3 className="mb-4">User: {user?.displayName ?? "未登入"}</h3>
      <button
        onClick={signIn}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign In with Google
      </button>
    </div>
  );
}
