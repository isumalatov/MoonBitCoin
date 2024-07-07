"use client";
import Image from "next/image";
import Avatar01 from "@/public/images/dogecoin.jpg";
import Avatar02 from "@/public/images/bnb.jpg";
import Avatar03 from "@/public/images/bitcoin.jpg";
import Avatar04 from "@/public/images/litecoin.jpg";
import Avatar05 from "@/public/images/dash.jpg";
import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  FaucetClaim,
  FetchUserData,
  ReCaptchaVerify,
} from "@/app/actions/user";
import { toast } from "react-toastify";
import { UserDataClaim } from "@/app/lib/definitions";
import ReCAPTCHA from "react-google-recaptcha";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

export default function ClaimForm() {
  const [user, setUser] = useState<UserDataClaim | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { success, response } = await FetchUserData("bitcoin");
      if (success) {
        console.log(response);
        setUser(response as UserDataClaim);
      } else {
        toast.error(response as string);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleClaim() {
    const { success, response } = await FaucetClaim("bitcoin");
    if (success) {
      toast.success(response);
      const userData = await FetchUserData("bitcoin");
      if (userData.success) {
        console.log(userData.response);
        setUser(userData.response as UserDataClaim);
      }
    } else {
      toast.error(response);
    }
  }

  async function handleRecaptcha(token: string | null) {
    if (!token) {
      return;
    }
    const { success, response } = await ReCaptchaVerify(token);
    if (success) {
      setIsVerified(true);
    } else {
      toast.error(response);
      recaptchaRef.current?.reset();
    }
  }

  async function handleChangedRecaptcha(token: string | null) {
    await handleRecaptcha(token);
  }

  async function handleExpiredRecaptcha() {
    setIsVerified(false);
  }

  return (
    <>
      <div className="relative flex items-center justify-center gap-10 before:h-px before:w-full before:border-b before:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.8),transparent)1] dark:before:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.16),transparent)1] before:shadow-sm before:shadow-white/20 dark:before:shadow-none after:h-px after:w-full after:border-b after:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.8),transparent)1] dark:after:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.16),transparent)1] after:shadow-sm after:shadow-white/20 dark:after:shadow-none mb-11">
        <div className="w-full max-w-xs mx-auto shrink-0">
          <div className="relative">
            {/* Border with dots in corners */}
            <div
              className="absolute -inset-3 bg-indigo-500/15 dark:bg-transparent dark:bg-gradient-to-b dark:from-gray-700/80 dark:to-gray-700/70 rounded-lg -z-10 before:absolute before:inset-y-0 before:left-0 before:w-[15px] before:bg-[length:15px_15px] before:[background-position:top_center,bottom_center] before:bg-no-repeat before:[background-image:radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px)] dark:before:[background-image:radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px)] after:absolute after:inset-y-0 after:right-0 after:w-[15px] after:bg-[length:15px_15px] after:[background-position:top_center,bottom_center] after:bg-no-repeat after:[background-image:radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px)] dark:after:[background-image:radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px)]"
              aria-hidden="true"
            />
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <ReCAPTCHA
                  sitekey={recaptchaSiteKey}
                  ref={recaptchaRef}
                  onChange={handleChangedRecaptcha}
                  onExpired={handleExpiredRecaptcha}
                />
              </div>
              <div>
                <button
                  className={`btn text-gray-100 bg-gray-900 hover:bg-gray-800 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-white w-full ${
                    !isVerified ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!isVerified}
                  onClick={handleClaim}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-center gap-10 before:h-px before:w-full before:border-b before:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.8),transparent)1] dark:before:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.16),transparent)1] before:shadow-sm before:shadow-white/20 dark:before:shadow-none after:h-px after:w-full after:border-b after:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.8),transparent)1] dark:after:[border-image:linear-gradient(to_right,transparent,theme(colors.indigo.300/.16),transparent)1] after:shadow-sm after:shadow-white/20 dark:after:shadow-none mb-11">
        <div className="w-full max-w-sm mx-auto shrink-0 flex h-[120px]">
          {/* Border with dots in corners */}
          <div
            className="w-[410px] mx-auto absolute -inset-3 bg-indigo-500/15 dark:bg-transparent dark:bg-gradient-to-b dark:from-gray-700/80 dark:to-gray-700/70 rounded-lg -z-10 before:absolute before:inset-y-0 before:left-0 before:w-[15px] before:bg-[length:15px_15px] before:[background-position:top_center,bottom_center] before:bg-no-repeat before:[background-image:radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px)] dark:before:[background-image:radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px)] after:absolute after:inset-y-0 after:right-0 after:w-[15px] after:bg-[length:15px_15px] after:[background-position:top_center,bottom_center] after:bg-no-repeat after:[background-image:radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.indigo.500/.56)_1.5px,transparent_1.5px)] dark:after:[background-image:radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px),radial-gradient(circle_at_center,theme(colors.gray.600)_1.5px,transparent_1.5px)]"
            aria-hidden="true"
          />
          <div className="w-2/3 h-full rounded-md mr-12 text-gray-100 bg-gray-900 hover:bg-gray-800 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-white">
            <h1 className="mt-4 text-center text-gray-100 dark:text-gray-800">
              Current claim:
            </h1>
            <p className={`text-center font-bold text-2xl`}>
              {loading
                ? "Loading..."
                : user?.currentclaim === 0
                ? "0"
                : user?.currentclaim.toFixed(9)}
            </p>
          </div>
          <div className="w-2/3 h-full rounded-md text-gray-100 bg-gray-900 hover:bg-gray-800 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-white">
            <h1 className="mt-4 text-center text-gray-100 dark:text-gray-800">
              Daily bonus:
            </h1>
            {loading ? (
              <p className={`text-center font-bold text-2xl`}>Loading...</p>
            ) : (
              <p className={`text-center font-bold text-2xl`}>
                {user?.dailybonus}%
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          {/* Avatars */}
          <ul className="flex justify-center -space-x-2 mb-4">
            <li>
              <Image
                className="rounded-full"
                src={Avatar01}
                width={32}
                height={32}
                alt="Avatar 01"
              />
            </li>
            <li>
              <Image
                className="rounded-full"
                src={Avatar02}
                width={32}
                height={32}
                alt="Avatar 02"
              />
            </li>
            <li>
              <Image
                className="rounded-full"
                src={Avatar03}
                width={32}
                height={32}
                alt="Avatar 03"
              />
            </li>
            <li>
              <Image
                className="rounded-full"
                src={Avatar04}
                width={32}
                height={32}
                alt="Avatar 04"
              />
            </li>
            <li>
              <Image
                className="rounded-full"
                src={Avatar05}
                width={32}
                height={32}
                alt="Avatar 05"
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
