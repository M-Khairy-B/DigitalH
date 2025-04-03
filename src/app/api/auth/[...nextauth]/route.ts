import NextAuth, { NextAuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    accessToken: string;
    refreshToken: string;
  }

  interface JWT {
    accessToken: string;
    refreshToken: string;
  }
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "https://api.escuelajs.co/api/v1";

          const { data } = await axios.post<LoginResponse>(
            `${apiUrl}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          if (data?.access_token) {
            return {
              id: credentials?.email ?? "unknown",
              email: credentials?.email ?? "unknown",
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Login error:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
