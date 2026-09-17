"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../actions/auth";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    try {
      await registerUser(formData);
      router.push("/login");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
  }

    return (
    <main className="flex min-h-screen items-center justify-center bg-[#F1EFE8] px-6">
      <div className="w-full max-w-sm border border-[#D8D3C7] bg-[#FBFAF7] px-10 py-12 text-[#1F2937] shadow-[0_1px_2px_rgba(31,41,55,0.06)]">
        <p className="mb-1 text-center font-mono text-[11px] tracking-wide text-[#8B7355]">
          Start your list
        </p>
        <h1 className="mb-8 text-center font-serif text-4xl text-[#1F2937]">Create an account</h1>

        {error && (
          <p className="mb-4 border border-[#A13D3D]/30 bg-[#A13D3D]/5 p-2 text-center text-[14px] text-[#A13D3D]">
            {error}
          </p>
        )}

        <form action={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            className="border border-[#D8D3C7] bg-transparent p-3 text-[15px] text-[#1F2937] placeholder:text-[#A8A296] focus:border-[#1F2937] focus:outline-none"
          />
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
            Sign up
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] text-[#5B6472]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#2F5233] hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </main>
  );
}