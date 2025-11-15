"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
console.log("API BASE =", process.env.NEXT_PUBLIC_API_URL);
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please fill all fields!");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const data = res.data;
      console.log("LOGIN SUCCESS:", data);

      // Store Token + Role + Name
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("userName", data.user.name);

      // Redirect based on role
      if (data.user.role === "STAFF") router.push("/staff");
      else if (data.user.role === "SUPERVISOR") router.push("/supervisor");
      else if (data.user.role === "ADMIN") router.push("/admin");
      else router.push("/");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-64">

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
          Login
        </button>

      </form>
    </div>
  );
}
