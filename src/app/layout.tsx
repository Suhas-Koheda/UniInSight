// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import Logo from "@/app/images/LOGO.png";
import SessionWrapper from "@/app/components/SessionWrapper";  // Import the client component

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "UniInSight",
    description: "",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
            <header className="h-20 w-screen bg-header">
                <Image src={Logo} alt='Suhas Koheda' className='h-20 w-auto pl-4 pb-1'/>
            </header>
            {children}
        </SessionWrapper>
        </body>
        </html>
    );
}
