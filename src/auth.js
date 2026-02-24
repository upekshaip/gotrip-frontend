import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { login } from "./app/actions/Authentication";
import { setJWT } from "./app/actions/AddJWT";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        userData: { label: "User Data", type: "text" },
      },
      authorize: async (credentials) => {
        const data = JSON.parse(credentials.userData);
        return data;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      if (trigger === "update") {
        if (session?.viewAs) {
          token.user.viewAs = session.viewAs;
        }
        if (session?.accessToken) {
          token.user.accessToken = session.accessToken;
        }
        if (session?.name) {
          token.user.name = session.name;
        }
        if (session?.email) {
          token.user.email = session.email;
        }
        if (session?.phone) {
          token.user.phone = session.phone;
        }
        if (session?.address) {
          token.user.address = session.address;
        }
        if (session?.gender) {
          token.user.gender = session.gender;
        }
        if (session?.dob) {
          token.user.dob = session.dob;
        }
        if (session?.accessToken) {
          token.user.accessToken = session.accessToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      session.user.accessToken = token.user.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
