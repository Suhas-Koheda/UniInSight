import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import Person from "@/model/Person";

// Define a User type
type User = {
    _id: string;
    username: string;
    role: string;
};

type Credentials = {
    username: string;
    password: string;
    id: string;
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: "Credentials",
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
                id: { label: 'ID', type: 'text' },
            },
            async authorize(credentials: Credentials | undefined): Promise<User | null> {
                if (!credentials) {
                    throw new Error("Credentials not provided");
                }

                await dbConnect(); // Ensure connection is established

                try {
                    const user = await Person.findOne({ username: credentials.username });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isPwdCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPwdCorrect) {
                        throw new Error("Invalid Credentials");
                    }

                    console.log(credentials.id);
                    console.log(user.role.toString());
                    // Check if ID matches
                    if (credentials.id !== user.role.toString()) {
                        throw new Error("User not related to this");
                    }

                    // Return user object if everything is correct
                    return { _id: user._id.toString(), username: user.username, role: user.role };
                } catch (err) {
                    console.error(err); // Log detailed error
                    throw new Error(err.message || "Error logging in");
                }
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user = {
                    _id: token._id?.toString(),
                    username: token.username,
                    role: token.role,
                };
            }
            return session;
        },
        async jwt({ user, token }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },
    },
    pages: {
        signIn: '/[id]/login',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRETKEY
};
