import 'next-auth';
import {DefaultSession} from "next-auth"; // Importing the custom Person model

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string;
            username?: string;
            email?: string;
            role?: string;
            joinedOn?: Date;
        } & DefaultSession['user'];
    }

    interface User {
        _id?: string;
        username?: string;
        email?: string;
        role?: string;
        joinedOn?: Date;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        username?: string;
        email?: string;
        role?: string;
        joinedOn?: Date;
    }
}
