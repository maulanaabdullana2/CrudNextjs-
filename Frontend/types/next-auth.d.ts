import NextAuth from "next-auth";

declare module 'next-auth' {
    interface Session {
        user: {
            _id: number,
            name: string,
            email: string,
            imageProfile:String,
            accessToken:string
        }
    }
}