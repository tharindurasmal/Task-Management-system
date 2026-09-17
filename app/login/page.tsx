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
    <main className="flex min-h-screen items-center justify-center bg-[#F1EFE8] px-6">
      <div className="w-full max-w-sm border border-[#D8D3C7] bg-[#FBFAF7] px-10 py-12 text-[#1F2937] shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
        <p className="mb-1 text-center font-mono text-[11px] tracking-wide text-[#8B7355]">
          Good to see you
        </p>
        <h1 className="mb-8 text-center font-serif text-4xl text-[#1F2937]">Welcome back</h1>

        {error && (
          <p className="mb-4 border border-[#A13D3D]/30 bg-[#A13D3D]/5 p-2 text-center text-[14px] text-[#A13D3D]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            className="border border-[#D8D3C7] bg-transparent p-3 text-[15px] text-[#1F2937] placeholder:text-[#A8A296] focus:border-[#1F2937] focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="border border-[#D8D3C7] bg-transparent p-3 text-[15px] text-[#1F2937] placeholder:text-[#A8A296] focus:border-[#1F2937] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#1F2937] p-3 font-medium text-[#FBFAF7] transition-colors hover:bg-[#2F5233]"
          >
            Log in
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] text-[#5B6472]">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-[#2F5233] hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}