"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Use NextAuth signIn function
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");//login successful
      router.refresh();
    }
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg text-slate-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
      
      {error && <p className="text-red-500 mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="email" name="email" placeholder="Email Address" required className="border p-3 rounded-lg" />
        <input type="password" name="password" placeholder="Password" required className="border p-3 rounded-lg" />
        <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-semibold">
          Log In
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm">
        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up here</Link>
      </p>
    </main>
  );
}