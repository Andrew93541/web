"use client";

import { useRegister } from "@/hooks/use-auth";
import Link from "next/link";
import { useState } from "react";
import { Cloud } from "lucide-react";

export default function RegisterPage() {
    const register = useRegister();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register.mutate({ email, password, name });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl ring-1 ring-slate-900/5">
                <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Cloud className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                        Create an account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="relative block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-lg border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Password (minimum 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={register.isPending}
                            className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition"
                        >
                            {register.isPending ? "Creating account..." : "Sign up"}
                        </button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}
