"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Your Profile</h1>
            <p>User ID: {params.id}</p>
        </div>
    );
}
