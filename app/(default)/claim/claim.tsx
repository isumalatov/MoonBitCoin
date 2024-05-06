export const metadata = {
  title: "MoonBitcoin - Faucet",
  description: "Bitcoin Free Faucet",
};

import PageHeader from "@/components/page-header";
import SubscribeForm from "@/components/subscribe-form";

export default function Home() {
  return (
    <section>
      <div className="pt-32 pb-12 md:pt-44 md:pb-20">
        <div className="px-4 sm:px-6">
          <PageHeader
            className="mb-12"
            title="Welcome to Moon Bitcoin Free Bitcoin Faucet"
            description="Please, enter your Mooner email below to get started"
          >
            Login to start earning
          </PageHeader>
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}