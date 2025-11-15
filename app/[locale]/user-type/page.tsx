"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function UserTypePage() {
  const t = useTranslations("userType");
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleFarmerSelect = () => {
    router.push("/login?type=farmer");
  };

  const handleBuyerSelect = () => {
    router.push("/login?type=buyer");
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Decorative Ellipse */}
      <div className="absolute top-[66px] left-[-276px] w-[551px] h-[566px] bg-gradient-to-br from-purple/30 to-teal/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[29px] w-[545px] h-[567px] bg-gradient-to-tl from-green/20 to-yellow/30 rounded-full blur-3xl" />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-20 w-[41px] h-[41px] rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-brown" />
      </button>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
        {/* Farmer Card */}
        <Card
          variant="farmer"
          className="w-full max-w-sm h-[177px] relative overflow-hidden cursor-pointer"
          onClick={handleFarmerSelect}
        >
          {/* Decorative bars */}
          <div className="absolute left-[11px] top-[9px] w-[27px] h-[140px] bg-green/30 rounded-full" />
          <div className="absolute right-[11px] top-[4px] w-[27px] h-[140px] bg-green/30 rounded-full" />

          {/* Background Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[287px] h-[153px] bg-gradient-to-br from-purple/40 to-green/30 rounded-[20px] flex items-center justify-center">
              <span className="text-6xl">🌾</span>
            </div>
          </div>

          {/* Text */}
          <div className="absolute bottom-0 left-0 right-0 h-[49px] bg-yellow rounded-b-[34px] flex items-center justify-center border-t-2 border-black">
            <span className="text-2xl font-mukta font-extrabold text-brown">
              {t("farmer")}
            </span>
          </div>
        </Card>

        {/* Buyer Card */}
        <Card
          variant="buyer"
          className="w-full max-w-sm h-[177px] relative overflow-hidden cursor-pointer"
          onClick={handleBuyerSelect}
        >
          {/* Decorative bars */}
          <div className="absolute left-[11px] top-[9px] w-[27px] h-[140px] bg-teal/30 rounded-full" />
          <div className="absolute right-[11px] top-[4px] w-[27px] h-[140px] bg-teal/30 rounded-full" />

          {/* Background Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[287px] h-[153px] bg-gradient-to-br from-teal/40 to-blue-300/30 rounded-[20px] flex items-center justify-center">
              <span className="text-6xl">🏭</span>
            </div>
          </div>

          {/* Text */}
          <div className="absolute bottom-0 left-0 right-0 h-[49px] bg-yellow rounded-b-[34px] flex items-center justify-center border-t-2 border-black">
            <span className="text-2xl font-mukta font-extrabold text-brown">
              {t("buyer")}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
