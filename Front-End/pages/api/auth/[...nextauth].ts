import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/User";
import { compare } from "bcrypt";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // Find user with the email
        const user = await User.findOne({
          email: credentials?.email,
        });

        // Email Not found
        if (!user) {
          throw new Error("Email is not registered");
        }

        // Check hased password with DB hashed password
        const isPasswordCorrect = await compare(
          credentials!.password,
          user.hashedPassword
        );

        // Incorrect password
        if (!isPasswordCorrect) {
          throw new Error("Password is incorrect");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  adapter: MongoDBAdapter(clientPromise),
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_JWT_SECRET,
});
