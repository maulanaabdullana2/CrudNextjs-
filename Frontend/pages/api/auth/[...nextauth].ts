import axios from "axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from 'next-auth/providers/google'

const nextAuthOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialProvider({
            type: "credentials",
            credentials: {
                email: {
                    label: "email",
                    type: "email",
                    placeholder: "email",
                },
                password: {
                    label: "password",
                    type: "password",
                    placeholder: "password",
                }
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as { email: string, password: string }
                const response = await axios.post(`http://localhost:4000/api/v1/auth/login`, {
                    email,
                    password
                });
                if (response.status == 200) {
                    return response.data.data
                } else {
                    throw new Error(response.data.status);
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account?.type === 'oauth') {
                const response = await axios.post(`http://localhost:4000/api/v1/auth/login-google`, {
                        email: token.email as string,
                        imageProfile: token.picture as string,
                });

                const data = await response.data
                const accessToken = data.data.accessToken
                token.accessToken = accessToken
            }
            return { ...token, ...user }
            
        },
        
        async session({ session, token }) {
            console.log(token);

            const response = await axios.get(
                `http://localhost:4000/api/v1/auth/me`,
                {
                    headers: { Authorization: `Bearer ${token.accessToken}` },
                }
            );
            session.user._id = response.data.data.user._id;
            session.user.email = response.data.data.user.email;
            session.user.name = response.data.data.user.name;
            session.user.imageProfile = response.data.data.user.imageProfile
            session.user.accessToken = token?.accessToken as string
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(nextAuthOptions);