import { fetchRedis } from "@/helpers/redis";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import gitHubProvider from "next-auth/providers/github";
import { db } from "./db";

function getGitHubCredentials() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GITHUB_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GITHUB_CLIENT_SECRET");
  }

  return {
    clientId,
    clientSecret,
  };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    gitHubProvider({
      clientId: getGitHubCredentials().clientId,
      clientSecret: getGitHubCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // this way getting the user's information will get the cache information, instead the current user's
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;
      // const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
      //   | string
      //   | null;
      // const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
      //   | string
      //   | null

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      // const dbUser = JSON.parse(dbUserResult);

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
