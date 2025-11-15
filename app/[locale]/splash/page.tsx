"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push("/user-type");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden flex items-center justify-center">
      {/* Decorative Ellipses */}
      <div className="absolute top-[16px] left-[-376px] w-[646px] h-[657px] bg-gradient-to-br from-teal/30 to-purple/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[99px] w-[545px] h-[567px] bg-gradient-to-tl from-green/20 to-yellow/30 rounded-full blur-3xl" />

      {/* Logo Container */}
      <div className="relative z-10 w-[296px] h-[296px] rounded-[148px] overflow-hidden bg-gold border-4 border-black shadow-card flex items-center justify-center">
        {/* Placeholder for KhetSe Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-6xl font-mukta font-extrabold text-brown mb-2">
            KhetSe
          </div>
          <div className="text-base font-mukta font-semibold text-brown/70">
            ECOX Labs
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-brown rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-brown rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-brown rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
