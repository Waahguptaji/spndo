import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/components/lib/mockDb";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    console.log('No credentials provided.');
                    return null;
                }
                console.log('Login attempt for email:', credentials.email);
                const user = findUserByEmail(credentials.email);

                if (!user) {
                    console.log('User not found.');
                    return null;
                }

                console.log('User found. Submitted password:', credentials.password);
                console.log('Stored password:', user.password);

                if (user.password === credentials.password) {
                    console.log('Passwords match. Login successful.');
                    return { id: user.id, email: user.email };
                } else {
                    console.log('Passwords do not match. Login failed.');
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };