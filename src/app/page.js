"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "STAFF") router.replace("/staff");
      else if (role === "SUPERVISOR") router.replace("/supervisor");
      else if (role === "ADMIN") router.replace("/admin");
    }
  }, []);

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508873535684-277a3cbcc4e9?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 backdrop-blur-lg bg-white/10 p-10 rounded-2xl max-w-xl w-[90%] text-center shadow-2xl border border-white/20">

        <h1 className="text-4xl text-white mb-4">
          Welcome to <span className="text-green-300">VatavaranTrack</span>
        </h1>

        <p className="text-white/90 text-lg mb-8">
          Smart Waste Collection & Approval System
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl bg-green-500 text-white"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 rounded-xl bg-white/20 text-white"
          >
            Signup
          </button>
        </div>

      </div>
    </div>
  );
}
