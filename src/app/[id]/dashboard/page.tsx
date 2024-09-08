"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log("Session Status:", status);
        console.log("Session Data:", session);

        if (status === "unauthenticated") {
            console.log("User is unauthenticated, redirecting to /login");
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome to your Dashboard, {session?.user?.name}</h1>
            <p>This is your unique route: {params.id}</p>
        </div>
    );
}
