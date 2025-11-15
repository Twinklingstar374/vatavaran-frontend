"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      const data = res.data;

      // Save auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role || "STAFF");
      localStorage.setItem("userName", name);

      router.push("/staff");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">

      <h1 className="text-3xl font-bold mb-4">Signup</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-3 w-64">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded bg-white text-black"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded bg-white text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded bg-white text-black"
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 py-2 rounded"
        >
          Signup
        </button>

      </form>
    </div>
  );
}
