"use client";
import { useState, useEffect } from "react";
import "../_styles/ServerAwake.css";

export default function ServerAwake({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAwake, setIsAwake] = useState(false);
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${BASE}/department`);
        if (res.ok) {
          setIsAwake(true);
        } else {
          throw new Error("Server not ready");
        }
      } catch (e) {
        setTimeout(checkServer, 2000);
      }
    };
    checkServer();
  }, []);

  if (!isAwake) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Waking up the server...
          </h1>
          <p className="text-gray-600 mb-8">
            This may take up to 15-60 seconds due to free tier hosting.
          </p>

          <div className="loader"></div>

          <p className="text-sm text-gray-400 mt-8">
            Please wait, you will be redirected automatically.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

