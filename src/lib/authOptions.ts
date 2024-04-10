import requestIp from "request-ip";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDomainName } from "@/lib/get-domain-name";

const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "username" },
      },
      async authorize(credentials, req) {
        try {
          const { host } = req.headers!;
          const { ParsedUserName: UserName, OTP }: any = credentials;
          const DomainName = getDomainName(host);
          const data = await axios({
            baseURL: process.env.NEXT_BASE_URL,
            url: "auth/auth/loginNew",
            method: "POST",
            headers: {
              origin: DomainName,
            },
            data: {
              UserName: UserName,
              Password: OTP,
              useragent: OTP && req.headers && req.headers["user-agent"],
              ip: OTP && requestIp.getClientIp(req),
            },
          });
          return {
            ...data.data.tokens,
          };
        } catch (error: any) {
          console.log(error);

          throw new Error(error?.response?.data?.message);
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update") {
        token = session.user;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      return { ...session, user: token };
    },
  },
};

export default authOptions;
