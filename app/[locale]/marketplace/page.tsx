"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/Card";
import Image from "next/image";

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const products = [
    {
      id: "straw",
      name: t("straw"),
      image: "/assets/parali.png",
      category: "raw-material",
    },
    {
      id: "fiber-market",
      name: t("fiberMarket"),
      image: "/assets/chatai.png",
      category: "processed",
      link: "./fiber-products",
    },
  ];

  const handleProductClick = (product: typeof products[0]) => {
    if (product.link) {
      router.push(product.link);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/", "_blank");
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Decorative Ellipses */}
      <div className="absolute top-[315px] right-[244px] w-[200px] h-[200px] bg-gradient-to-br from-orange/20 to-yellow/30 rounded-full blur-3xl" />
      <div className="absolute top-[331px] left-[-276px] w-[551px] h-[566px] bg-gradient-to-br from-purple/20 to-teal/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[29px] w-[545px] h-[567px] bg-gradient-to-tl from-green/15 to-yellow/20 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="h-16 border-b border-black/10 flex items-center px-4">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-[45px] h-[34px] flex flex-col justify-around items-end"
          >
            <div className="w-[29px] h-[2px] bg-brown" />
            <div className="w-[29px] h-[2px] bg-brown" />
            <div className="w-[29px] h-[2px] bg-brown" />
          </button>

          {/* Logo */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[204px] h-[39px] bg-gradient-to-r from-gold to-yellow rounded-[20px] border-2 border-black flex items-center justify-center px-2">
              <Image
                src="/assets/khetse logo.png"
                alt="KhetSe Logo"
                width={180}
                height={35}
                className="object-contain"
              />
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-[56px] h-[56px] rounded-full bg-gold border-2 border-black shadow-card flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2 w-full max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder={t("search")}
              className="w-full h-12 rounded-input border border-black bg-cream-light pl-11 pr-16 text-base md:text-lg font-mukta text-brown placeholder:text-brown/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown/60" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-yellow flex items-center justify-center border border-black/20">
              <Mic className="w-4 h-4 text-brown" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative z-10 px-6 space-y-6 mt-4 max-w-2xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="space-y-2">
            {/* Product Card */}
            <Card
              variant="product"
              className="w-full h-[195px] relative overflow-hidden cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {/* Background/Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange/20 to-yellow/30 flex items-center justify-center border-b-2 border-black">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Category Badge (optional) */}
              {product.category === "processed" && (
                <div className="absolute top-4 right-4 bg-yellow px-3 py-1 rounded-full border border-black">
                  <span className="text-sm font-mukta font-semibold text-brown">
                    NEW
                  </span>
                </div>
              )}
            </Card>

            {/* Product Name */}
            <div className="bg-yellow rounded-[24.5px] border-2 border-black shadow-card py-2 flex items-center justify-center">
              <span className="text-2xl font-mukta font-extrabold text-brown">
                {product.name}
              </span>
            </div>
          </div>
        ))}
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

      {/* Sidebar Menu (Placeholder) */}
      {/* Sidebar Menu */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
