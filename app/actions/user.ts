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
          lastclaimbitcoin: new Date("1999-01-01"),
          lastclaimbnb: new Date("1999-01-01"),
          lastclaimdash: new Date("1999-01-01"),
          lastclaimdogecoin: new Date("1999-01-01"),
          lastclaimlitecoin: new Date("1999-01-01"),
        };
        const newUser = new User(UserData);
        await newUser.save();
        await createSession(newUser._id, newUser.email);
        return { success: true, response: "User Signin good" };
      } else {
        await createSession(user._id, user.email);
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

    const CPM = 1;

    if (coin === "bitcoin") {
      const currentTime = new Date();
      const lastClaimTime = user.lastclaimbitcoin;
      const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
      const minutesPassed = Math.floor(timeDifference / (1000 * 60));
      if (minutesPassed < 5) {
        throw new Error("Please wait for 5 minutes before claiming again");
      }
      user.bitcoin += ((0.0001 * CPM) / 60) * minutesPassed;
      user.lastclaimbitcoin = new Date();
    } else if (coin === "bnb") {
      const currentTime = new Date();
      const lastClaimTime = user.lastclaimbnb;
      const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
      const minutesPassed = Math.floor(timeDifference / (1000 * 60));
      if (minutesPassed < 5) {
        throw new Error("Please wait for 5 minutes before claiming again");
      }
      user.bnb += ((0.0001 * CPM) / 60) * minutesPassed;
      user.lastclaimbnb = new Date();
    } else if (coin === "dash") {
      const currentTime = new Date();
      const lastClaimTime = user.lastclaimdash;
      const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
      const minutesPassed = Math.floor(timeDifference / (1000 * 60));
      if (minutesPassed < 5) {
        throw new Error("Please wait for 5 minutes before claiming again");
      }
      user.dash += ((0.0001 * CPM) / 60) * minutesPassed;
      user.lastclaimdash = new Date();
    } else if (coin === "dogecoin") {
      const currentTime = new Date();
      const lastClaimTime = user.lastclaimdogecoin;
      const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
      const minutesPassed = Math.floor(timeDifference / (1000 * 60));
      if (minutesPassed < 5) {
        throw new Error("Please wait for 5 minutes before claiming again");
      }
      user.dogecoin += ((0.0001 * CPM) / 60) * minutesPassed;
      user.lastclaimdogecoin = new Date();
    }

    await user.save();
  } catch (error) {
    console.error(error);
  }
}
