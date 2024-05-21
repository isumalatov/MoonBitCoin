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
    var price = 0;

    fetch(`https://api.coincap.io/v2/assets/${coin}`, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        price = parseFloat(result.data.priceUsd);
      })
      .catch((error) => {
        throw new Error("Failed to fetch coin data");
      });

    const coins = ["bitcoin", "bnb", "dash", "dogecoin", "litecoin"];
    if (!coins.includes(coin)) {
      throw new Error("Invalid coin");
    }

    const currentTime = new Date();
    const lastClaimTime = user[`lastclaim${coin}`];
    const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
    var minutesPassed = Math.floor(timeDifference / (1000 * 60));
    console.log(minutesPassed);

    if (minutesPassed < 5) {
      throw new Error("Please wait for 5 minutes before claiming again");
    }

    if (minutesPassed > 60) {
      minutesPassed = 60;
    }

    console.log(CPM, price, minutesPassed);
    console.log(((0.0001 * CPM) / 60) * minutesPassed);
    console.log((((0.0001 * CPM) / 60) * minutesPassed) / price);

    user[coin] += (((0.0001 * CPM) / 60) * minutesPassed) / price;
    user[`lastclaim${coin}`] = new Date();

    await user.save();
    return { success: true, response: "¡Claimed!" };
  } catch (error) {
    return { success: false, response: (error as Error).message as string };
  }
}
