"use client";  // This makes sure this component is rendered on the client-side

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}