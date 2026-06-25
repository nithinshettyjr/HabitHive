import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (response.data.user) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              accessToken: response.data.token,  // backend JWT stored here
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    // jwt() runs on sign-in and on every session access
    async jwt({ token, user, account }) {
      // ── Credentials login ────────────────────────────────────────────────
      if ((user as any)?.accessToken) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }

      // ── Google OAuth: call our backend to get/create user + JWT ──────────
      if (account?.provider === "google" && user) {
        try {
          const res = await axios.post(`${API_URL}/auth/google-signin`, {
            email: user.email,
            name: user.name,
          });
          // Store the backend-issued JWT in the NextAuth token
          token.accessToken = res.data.token;
          token.id = res.data.user.id;
        } catch (error) {
          console.error("Google sign-in backend error:", error);
        }
      }

      return token;
    },

    // session() exposes the token fields to the client
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken as string;
      (session as any).user = {
        ...session.user,
        id: token.id as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
