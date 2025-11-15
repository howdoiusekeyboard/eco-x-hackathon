"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";

export default function ProductDetailPage() {
  const t = useTranslations("product");
  const router = useRouter();
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleConfirm = () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    // Store order data
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "orderData",
        JSON.stringify({
          productId: params.id,
          quantity,
          address,
          price: 1000,
        })
      );
    }

    router.push("/confirmation?type=delivery");
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/", "_blank");
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Decorative Ellipses */}
      <div className="absolute top-[66px] left-[-275px] w-[551px] h-[566px] bg-gradient-to-br from-purple/20 to-teal/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[29px] w-[545px] h-[567px] bg-gradient-to-tl from-green/15 to-yellow/20 rounded-full blur-3xl" />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-20 w-[41px] h-[41px] rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-brown" />
      </button>

      {/* Content */}
      <div className="relative z-10 pt-20 px-6">
        {/* Product Name */}
        <div className="mb-6 bg-yellow rounded-[36px] border-2 border-black shadow-card py-4 flex items-center justify-center">
          <h1 className="text-2xl font-mukta font-extrabold text-brown">
            {t("briquettes")}
          </h1>
        </div>

        {/* Product Image */}
        <div className="mb-6 bg-gradient-to-br from-orange/30 to-yellow/20 rounded-[36px] border-2 border-black shadow-card h-[194px] flex items-center justify-center overflow-hidden">
          <Image
            src="/assets/brickets.png"
            alt="Briquettes"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-[36px] border-2 border-black shadow-card p-6 mb-6 space-y-4">
          {/* Price */}
          <div>
            <p className="text-2xl font-mukta font-extrabold text-brown">
              {t("price", { price: "1000" })}
            </p>
            <p className="text-base font-mukta text-brown/70 mt-1">
              {t("taxIncluded")}
            </p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-base font-mukta font-semibold text-brown mb-2">
              {t("quantity", { quantity: "" })}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-cream-light border border-black rounded-input overflow-hidden h-[47px]">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 h-full hover:bg-cream transition-colors"
                >
                  <span className="text-2xl text-brown">−</span>
                </button>
                <div className="px-6 text-xl font-mukta font-semibold text-brown">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 h-full hover:bg-cream transition-colors"
                >
                  <span className="text-2xl text-brown">+</span>
                </button>
              </div>
              <ChevronDown className="w-6 h-6 text-brown" />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-base font-mukta font-semibold text-brown mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t("deliveryAddress")}
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              className="w-full rounded-[20px] border border-black bg-cream-light px-4 py-3 text-base font-inter text-brown placeholder:text-brown/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 min-h-[80px] resize-none"
            />
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full bg-yellow rounded-pill border-2 border-black shadow-card py-3 hover:bg-yellow/90 active:scale-[0.99] transition-all"
          >
            <span className="text-2xl font-mukta font-extrabold text-brown">
              {t("confirm")}
            </span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-cream-light rounded-[20px] border border-black p-4">
          <h3 className="text-base font-mukta font-semibold text-brown mb-2">
            Product Information
          </h3>
          <ul className="space-y-1 text-sm font-inter text-brown/70">
            <li>• Made from agricultural waste</li>
            <li>• Eco-friendly and sustainable</li>
            <li>• High calorific value</li>
            <li>• Ideal for biogas plants</li>
          </ul>
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


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
