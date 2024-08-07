"use server";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/models/User";
import { UserData, UserDataClaim } from "@/app/lib/definitions";
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
          lastclaimbitcoin: new Date(),
          lastclaimbnb: new Date(),
          lastclaimdash: new Date(),
          lastclaimdogecoin: new Date(),
          lastclaimlitecoin: new Date(),
          dailybonusbitcoin: 0,
          dailybonusbnb: 0,
          dailybonusdash: 0,
          dailybonusdogecoin: 0,
          dailybonuslitecoin: 0,
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

    try {
      const response = await fetch(`https://api.coincap.io/v2/assets/${coin}`, {
        method: "GET",
        redirect: "follow",
      });
      const result = await response.json();
      price = parseFloat(result.data.priceUsd);
    } catch (error) {
      throw new Error("Failed to fetch coin price");
    }

    const coins = ["bitcoin", "bnb", "dash", "dogecoin", "litecoin"];
    if (!coins.includes(coin)) {
      throw new Error("Invalid coin");
    }

    const currentTime = new Date();
    const lastClaimTime = user[`lastclaim${coin}`];
    const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
    var minutesPassed = Math.floor(timeDifference / (1000 * 60));
    var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (minutesPassed < 5) {
      throw new Error("Please wait for 5 minutes before claiming again");
    }

    if (minutesPassed > 60) {
      minutesPassed = 60;
    }

    if (daysPassed === 1) {
      user[`dailybonus${coin}`] = Math.min(user[`dailybonus${coin}`] + 1, 100);
    } else if (daysPassed > 1) {
      user.dailybonus = 0;
    }

    const bonusMultiplier = 1 + user[`dailybonus${coin}`] / 100;
    user[coin] +=
      (((0.0001 * CPM) / 60) * minutesPassed * bonusMultiplier) / price;
    user[`lastclaim${coin}`] = new Date();
    await user.save();
    return { success: true, response: "¡Claimed!" };
  } catch (error) {
    return { success: false, response: (error as Error).message as string };
  }
}

export async function FetchUserData(coin: string) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return { success: false, response: "Error fetching user data" };
    }
    const user = await User.findOne({ _id: session.userId });
    if (!user) {
      return { success: false, response: "Error fetching user data" };
    }

    const CPM = 1;
    var price = 0;

    try {
      const response = await fetch(`https://api.coincap.io/v2/assets/${coin}`, {
        method: "GET",
        redirect: "follow",
      });
      const result = await response.json();
      price = parseFloat(result.data.priceUsd);
    } catch (error) {
      throw new Error("Failed to fetch coin price");
    }

    const coins = ["bitcoin", "bnb", "dash", "dogecoin", "litecoin"];
    if (!coins.includes(coin)) {
      throw new Error("Invalid coin");
    }

    const currentTime = new Date();
    const lastClaimTime = user[`lastclaim${coin}`];
    const timeDifference = currentTime.getTime() - lastClaimTime.getTime();
    var minutesPassed = Math.floor(timeDifference / (1000 * 60));
    var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let dailybonususer = user[`dailybonus${coin}`];

    if (daysPassed === 1) {
      dailybonususer = Math.min(user[`dailybonus${coin}`] + 1, 100);
    } else if (daysPassed > 1) {
      dailybonususer = 0;
    }

    const bonusMultiplier = 1 + user[`dailybonus${coin}`] / 100;
    const currentclaim =
      (((0.0001 * CPM) / 60) * minutesPassed * bonusMultiplier) / price;
      
    const userData: UserDataClaim = {
      dailybonus: dailybonususer,
      currentclaim: currentclaim,
    };
    return { success: true, response: userData };
  } catch (err) {
    console.log(err);
    return { success: false, response: "Error fetching user data" };
  }
}

export async function ReCaptchaVerify(token: string) {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
      }
    );
    const result = await response.json();
    if (!result.success) {
      throw new Error("Failed to verify reCAPTCHA");
    }
    return { success: true, response: "reCAPTCHA verified" };
  } catch (error) {
    return { success: false, response: (error as Error).message as string };
  }
}
