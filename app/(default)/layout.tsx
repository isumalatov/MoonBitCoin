"use client";

import BgShapes from "@/components/bg-shapes";
import VerticalLines from "@/components/vertical-lines";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VerticalLines />
      <BgShapes />
      <Header />
      <ToastContainer />

      <main className="grow">{children}</main>

      <Footer />
    </>
  );
}
