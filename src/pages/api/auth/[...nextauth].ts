import NextAuth from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export default NextAuth(authOptions)