"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface LanguageOption {
  code: string;
  name: string;
  enabled: boolean;
}

export default function LanguageSelection() {
  const t = useTranslations("languageSelection");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const languages: LanguageOption[] = [
    { code: "hi", name: t("hindi"), enabled: true },
    { code: "en", name: t("english"), enabled: true },
    { code: "ta", name: t("tamil"), enabled: false },
    { code: "bn", name: t("bengali"), enabled: false },
    { code: "te", name: t("telugu"), enabled: false },
    { code: "kn", name: t("kannada"), enabled: false },
  ];

  const handleLanguageSelect = (lang: LanguageOption) => {
    if (lang.enabled) {
      // Use window.location for locale switching to avoid double locale prefix
      window.location.href = `/${lang.code}/splash`;
    } else {
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Decorative Ellipses */}
      <div className="absolute top-[-100px] left-[-100px] w-[471px] h-[485px] bg-gradient-to-br from-purple/30 to-teal/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-200px] w-[1030px] h-[457px] bg-gradient-to-tl from-orange/20 to-yellow/30 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Greeting */}
        <h1 className="text-4xl font-mukta font-extrabold text-brown text-center mb-4">
          {t("greeting")}
        </h1>

        {/* Title */}
        <p className="text-base font-mukta font-semibold text-brown text-center mb-12">
          {t("subtitle")}
        </p>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`
                relative h-[55px] rounded-[27.5px] border-2 border-black shadow-card
                flex items-center justify-center
                transition-all active:scale-95
                ${
                  lang.enabled
                    ? "bg-gold hover:bg-gold/80"
                    : "bg-cream-light hover:bg-cream-light/80"
                }
              `}
            >
              <span
                className={`text-xl font-mukta ${
                  lang.enabled ? "font-extrabold" : "font-semibold"
                } text-brown`}
              >
                {lang.name}
              </span>
              {!lang.enabled && (
                <span className="absolute top-[-8px] right-[-8px] bg-red text-white text-xs px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Please Select Text */}
        <p className="text-base font-mukta font-semibold text-brown text-center">
          {t("title")}
        </p>
      </div>

      {/* Coming Soon Toast */}
      {showComingSoon && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-brown text-cream px-6 py-3 rounded-pill shadow-lg z-50 animate-in slide-in-from-bottom">
          <p className="text-base font-mukta font-semibold">
            {t("comingSoon")}
          </p>
        </div>
      )}
    </div>
  );
}

// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';


