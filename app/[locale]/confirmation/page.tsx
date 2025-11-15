"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ConfirmationContent() {
  const t = useTranslations("confirmation");
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "pickup";

  const message = type === "pickup"
    ? t("pickupMessage")
    : t("deliveryMessage");

  const handleChangeTime = () => {
    router.push("/date-picker");
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/", "_blank");
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Decorative Ellipses */}
      <div className="absolute top-[331px] left-[-276px] w-[551px] h-[566px] bg-gradient-to-br from-purple/20 to-teal/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[29px] w-[545px] h-[567px] bg-gradient-to-tl from-green/15 to-yellow/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Success Message */}
          <div className="mb-8 text-center">
            {/* Check Mark */}
            <div className="mx-auto w-24 h-24 bg-green rounded-full border-4 border-black shadow-card flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Message */}
            <p className="text-3xl font-mukta font-extrabold text-brown leading-relaxed px-4">
              {message}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-[36px] border-2 border-black shadow-card p-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center mr-3 mt-1">
                  <span className="text-brown font-bold text-sm">✓</span>
                </div>
                <p className="text-base font-mukta text-brown">
                  Your request has been submitted successfully
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center mr-3 mt-1">
                  <span className="text-brown font-bold text-sm">📞</span>
                </div>
                <p className="text-base font-mukta text-brown">
                  We will contact you within 24 hours
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center mr-3 mt-1">
                  <span className="text-brown font-bold text-sm">📍</span>
                </div>
                <p className="text-base font-mukta text-brown">
                  Track your request status in My Orders
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              variant="danger"
              size="md"
              onClick={handleChangeTime}
              className="flex-1"
            >
              {t("changeTime")}
            </Button>
            <button
              onClick={handleContinue}
              className="flex items-center justify-center w-[122px] h-[54px] bg-green rounded-pill border-[5px] border-black shadow-card hover:bg-green/90 active:scale-95 transition-all"
            >
              <ArrowRight className="w-8 h-8 text-white stroke-[3]" />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-8 right-6 w-[56px] h-[56px] rounded-full bg-gradient-to-br from-green-600 to-green-500 border-[8px] border-black shadow-card z-30 flex items-center justify-center active:scale-95 transition-all"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-2xl font-mukta text-brown">Loading...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
