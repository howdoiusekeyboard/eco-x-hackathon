"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Sidebar } from "@/components/layout/Sidebar";

export default function FiberProductsPage() {
  const t = useTranslations("marketplace");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const fiberProducts = [
    {
      id: "compost",
      name: t("compost"),
      image: "🌱",
      position: "top-left",
    },
    {
      id: "basket",
      name: t("basket"),
      image: "🧺",
      position: "top-right",
    },
    {
      id: "handbag",
      name: t("handbag"),
      image: "👜",
      position: "bottom-left",
    },
    {
      id: "mat",
      name: t("mat"),
      image: "🎋",
      position: "bottom-right",
    },
  ];

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
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
            <div className="w-[204px] h-[39px] bg-gradient-to-r from-gold to-yellow rounded-[20px] border-2 border-black flex items-center justify-center">
              <span className="text-lg font-mukta font-extrabold text-brown">
                KhetSe
              </span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-[56px] h-[56px] rounded-full bg-gold border-2 border-black shadow-card flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="px-6 py-4">
          <div className="bg-yellow rounded-[36px] border-2 border-black shadow-card py-4 flex items-center justify-center">
            <h1 className="text-2xl font-mukta font-extrabold text-brown">
              {t("fiberMarket")}
            </h1>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative z-10 px-6">
        <div className="grid grid-cols-2 gap-4">
          {fiberProducts.map((product, index) => (
            <div key={product.id} className="space-y-2">
              {/* Product Card */}
              <Card
                variant="product"
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Background Image/Icon */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-green/20 flex items-center justify-center">
                  <div className="text-6xl">{product.image}</div>
                </div>

                {/* Circular Border Decorations (matching Figma design) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-[125px] h-[125px] border-2 border-brown/20 rounded-full" />
                </div>
              </Card>

              {/* Product Name Badge */}
              <div className="bg-yellow rounded-[20px] border-2 border-black shadow-card py-2 flex items-center justify-center">
                <span className="text-base font-mukta font-extrabold text-brown">
                  {product.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Info */}
        <div className="mt-8 bg-cream-light rounded-[20px] border border-black p-4">
          <h3 className="text-base font-mukta font-semibold text-brown mb-2">
            About Fiber Products
          </h3>
          <p className="text-sm font-inter text-brown/70">
            All products are made from agricultural waste fiber, supporting
            sustainable farming and creating value from crop residue.
          </p>
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


      {/* Sidebar Menu */}
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
