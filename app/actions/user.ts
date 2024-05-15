"use server";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/models/User";
import { UserData } from "@/app/lib/definitions";
import { createSession, deleteSession, getSession } from "@/app/lib/session";

export async function FaucetSignIn(email: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ email: email });
    if (!email || email.trim() === "") {
      throw new Error("Email is required");
    } else {
      if (!user) {
        const UserData: UserData = {
          email: email,
          bitcoin: 0,
          bnb: 0,
          dash: 0,
          dogecoin: 0,
          litecoin: 0,
        };
        const newUser = new User(UserData);
        await newUser.save();
        await createSession(email);
        return { success: true, response: "User Signin good" };
      } else {
        await createSession(email);
        return { success: true, response: "User Signin good" };
      }
    }
  } catch (error) {
    return { success: false, response: (error as Error).message as string };
  }
}

export async function FaucetClaim(coin: string) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      throw new Error("No session found");
    }
    const user = await User.findOne({ email: session.email });
    if (!user) {
      throw new Error("No user found");
    }
    if (coin === "bitcoin") {
      user.bitcoin += 0.00000002;
    } else if (coin === "bnb") {
      user.bnb += 0.00000002;
    } else if (coin === "dash") {
      user.dash += 0.00000002;
    } else if (coin === "dogecoin") {
      user.dogecoin += 0.00000002;
    } else if (coin === "litecoin") {
      user.litecoin += 0.00000002;
    } else {
      throw new Error("Invalid coin");
    }
    await user.save();
    return { success: true, response: "¡Claimed!" };
  } catch (error) {
    return { success: false, response: (error as Error).message as string };
  }
}
