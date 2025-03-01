"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ThankYou() {
  const route = useRouter();
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center px-4">
        <div className="mx-auto w-full flex justify-center">
          <Image
            src="/home/info-icon.png"
            objectFit="cover"
            width={90}
            height={18}
            alt=""
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Thank You</h1>

          <p className="max-w-lg mx-auto font-bold text-[#010000]">
            Your information was submitted to our team of immigration attorneys.
            Expect an email from hello@tryalma.ai.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full max-w-xs mx-auto mt-10"
          onClick={() => {
            route.push("/");

            document.cookie =
              "formSubmitted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }}
        >
          Go Back to Homepage
        </Button>
      </div>
    </div>
  );
}
