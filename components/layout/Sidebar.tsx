"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { X, Home, User, ShoppingCart, Users, Phone, Settings, DollarSign, FileText } from "lucide-react";
import { useLocale } from "next-intl";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations("menu");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const menuItems = [
    {
      key: "home",
      label: t("home"),
      icon: Home,
      path: `/${locale}/dashboard`,
    },
    {
      key: "myAccount",
      label: t("myAccount"),
      icon: User,
      path: `/${locale}/account`,
    },
    {
      key: "myOrders",
      label: t("myOrders"),
      icon: ShoppingCart,
      path: `/${locale}/orders`,
    },
    {
      key: "rent",
      label: t("rent"),
      icon: DollarSign,
      path: `/${locale}/rent`,
    },
    {
      key: "receipt",
      label: t("receipt"),
      icon: FileText,
      path: `/${locale}/receipts`,
    },
    {
      key: "farmerTalk",
      label: t("farmerTalk"),
      icon: Users,
      path: `/${locale}/community`,
    },
    {
      key: "contactUs",
      label: t("contactUs"),
      icon: Phone,
      path: `/${locale}/contact`,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
    router.push(`/${locale}`);
    onClose();
  };

  const handleLanguageChange = () => {
    // Toggle between Hindi and English
    const newLocale = locale === "hi" ? "en" : "hi";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[292px] bg-cream border-r-2 border-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-[56px] h-[56px] rounded-full bg-gold border-2 border-black shadow-card flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1">
              <div className="w-[204px] h-[39px] bg-gradient-to-r from-gold to-yellow rounded-[20px] border-2 border-black flex items-center justify-center">
                <span className="text-base font-mukta font-extrabold text-brown">
                  KhetSe
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-cream-light rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-brown" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-4 px-6 py-4 transition-colors ${
                    pathname === item.path
                      ? "bg-yellow/30"
                      : "hover:bg-cream-light"
                  }`}
                >
                  <Icon className="w-6 h-6 text-brown" />
                  <span className="text-base font-mukta font-semibold text-brown flex-1 text-left">
                    {item.label}
                  </span>
                  <svg
                    className="w-6 h-6 text-brown"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                {index < menuItems.length - 1 && (
                  <div className="mx-6 border-b border-black/10" />
                )}
              </div>
            );
          })}

          {/* Sign Out */}
          <div className="mx-6 border-b border-black/10 my-4" />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red/10 transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-xl">🚪</span>
            </div>
            <span className="text-base font-mukta font-semibold text-red-dark flex-1 text-left">
              {t("signOut")}
            </span>
          </button>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-black/10 bg-cream">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-brown" />
            </button>
            <button
              onClick={handleLanguageChange}
              className="bg-white rounded-[13px] border border-black px-4 py-1 hover:bg-cream-light transition-colors"
            >
              <span className="text-base font-mukta font-semibold text-brown">
                {t("language")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
