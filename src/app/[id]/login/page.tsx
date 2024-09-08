"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Extract 'id' from URL
        const parts = pathname.split('/');
        const idParam = parts[1];
        if (idParam) {
            setId(idParam);
        }
    }, [pathname]);

    useEffect(() => {
        // Check for error in the URL search params
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!id) {
            setError("ID is missing from the URL");
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password,
            id,
        });

        if (res?.error) {
            // Redirect to the same login page with the error message
            router.push(`/${id}/login?error=${encodeURIComponent(res.error)}`);
        } else {
            setError(null); // Clear error on successful login
            router.push(`/${id}/dashboard`); // Redirect after successful login
        }
    };

    return (
        <div className="grid cols-1 md:flex justify-around">
            {!error &&
            (<div className="items-center text-center"><h1 className="p-4 bg-red-300 rounded-lg my-4">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-auto ">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="bg-gray-100 text-black rounded-lg p-4"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="bg-gray-100 text-black rounded-lg p-4 my-4"
                />
                <button type="submit"  className="p-4 bg-button-bg rounded-lg">Login</button>
            </form>
        </div>
)}
            {error && (
                // {{ color: 'red', marginTop: '10px', border: '1px solid red', padding: '10px', borderRadius: '5px' }}
                <div className="red mt-4 border-2 border-red-600 w-fit p-4 h-fit rounded-lg">
                    {error}
                </div>
            )}
            {error && (
                <div className=" h-fit p-4 mt-4 bg-button-bg rounded-lg"><a href={`/${id}/login`}>Go back to Login</a></div>
            )}
        </div>
    );
}
