import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET is not set. Using default secret for development.');
  console.warn('⚠️ Set NEXTAUTH_SECRET in .env.local for production.');
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "cave-of-hiraa-secret-key-change-in-production",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("=== AUTH START ===");
          console.log("Credentials received:", {
            username: credentials?.username,
            hasPassword: !!credentials?.password,
          });

          if (!credentials?.username || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }

          console.log("Looking up user:", credentials.username);
          const { data: user, error } = await supabase
            .from("User")
            .select("*")
            .eq("username", credentials.username)
            .single();

          if (error) {
            console.error("❌ Database error:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
              console.log("❌ User not found:", credentials.username);
            } else {
              console.error("❌ Database connection issue. Check Supabase configuration.");
            }
            return null;
          }

          if (!user) {
            console.log("❌ User not found:", credentials.username);
            return null;
          }

          console.log("User found, checking password...");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("Password check result:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("❌ Invalid password for user:", credentials.username);
            return null;
          }

          console.log("✅ Authentication successful for:", credentials.username);
          const result = {
            id: user.id,
            name: user.username,
            role: user.role,
          };
          console.log("Returning user:", result);
          return result;
        } catch (error: any) {
          console.error("❌ Auth error:", error);
          console.error("Error stack:", error?.stack);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

