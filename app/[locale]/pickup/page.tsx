"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { Input } from "@/components/ui/Input";

const pickupSchema = z.object({
  cropType: z.string().min(1, "Please enter crop type"),
  harvestDate: z.string().min(1, "Please enter harvest date"),
  location: z.string().min(1, "Please enter location"),
  quantity: z.string().min(1, "Please enter quantity"),
  burning: z.string().min(1, "Please select an option"),
  photo: z.any().optional(),
});

type PickupFormData = z.infer<typeof pickupSchema>;

export default function PickupPage() {
  const t = useTranslations("pickupForm");
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PickupFormData>({
    resolver: zodResolver(pickupSchema),
  });

  const handleBack = () => {
    router.back();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("photo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PickupFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store form data and redirect to date picker
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pickupFormData", JSON.stringify(data));
    }

    router.push("/date-picker");
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Decorative Ellipses */}
      <div className="absolute top-[907px] right-[29px] w-[545px] h-[567px] bg-gradient-to-tl from-green/15 to-yellow/20 rounded-full blur-3xl" />
      <div className="absolute top-[459px] left-[-229px] w-[391px] h-[393px] bg-gradient-to-br from-purple/20 to-teal/15 rounded-full blur-3xl" />

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-20 w-[41px] h-[41px] rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-brown" />
      </button>

      {/* Content */}
      <div className="relative z-10 pt-20 px-6">
        {/* Title Banner */}
        <div className="mb-8 bg-yellow rounded-[36px] border-2 border-black shadow-card py-4 flex items-center justify-center">
          <h1 className="text-2xl font-mukta font-extrabold text-brown">
            {t("title")}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Crop Type */}
          <div>
            <label className="block text-xl font-mukta font-semibold text-brown mb-2">
              {t("cropType")}
              <span className="text-red ml-1">*</span>
            </label>
            <input
              {...register("cropType")}
              placeholder="....."
              className="flex w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-inter text-brown placeholder:text-brown/40 placeholder:font-thin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            />
            {errors.cropType && (
              <p className="mt-1 text-sm text-red">{errors.cropType.message}</p>
            )}
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-xl font-mukta font-semibold text-brown mb-2">
              {t("harvestDate")}
              <span className="text-red ml-1">*</span>
            </label>
            <input
              type="date"
              {...register("harvestDate")}
              className="flex w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-inter text-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            />
            {errors.harvestDate && (
              <p className="mt-1 text-sm text-red">{errors.harvestDate.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-xl font-mukta font-semibold text-brown mb-2">
              {t("location")}
              <span className="text-red ml-1">*</span>
            </label>
            <input
              {...register("location")}
              placeholder="....."
              className="flex w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-inter text-brown placeholder:text-brown/40 placeholder:font-thin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red">{errors.location.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xl font-mukta font-semibold text-brown mb-2">
              {t("quantity")}
              <span className="text-red ml-1">*</span>
            </label>
            <input
              {...register("quantity")}
              placeholder="....."
              className="flex w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-inter text-brown placeholder:text-brown/40 placeholder:font-thin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red">{errors.quantity.message}</p>
            )}
          </div>

          {/* Burning Status */}
          <div>
            <label className="block text-xl font-mukta font-semibold text-brown mb-2">
              {t("burning")}
              <span className="text-red ml-1">*</span>
            </label>
            <select
              {...register("burning")}
              className="flex w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-inter text-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="planning">Planning to</option>
            </select>
            {errors.burning && (
              <p className="mt-1 text-sm text-red">{errors.burning.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xl font-mukta font-semibold text-brown mb-2">
              {t("photo")}
              <span className="text-red ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-between w-full rounded-input border border-black bg-cream-light px-6 py-3 text-xl font-mukta text-brown cursor-pointer hover:bg-cream-light/80 h-[55px]"
              >
                <span className={photoPreview ? "text-green" : "text-brown/60"}>
                  {photoPreview ? "Photo uploaded ✓" : t("uploadPhoto")}
                </span>
                <Upload className="w-6 h-6 text-brown" />
              </label>
            </div>
            {photoPreview && (
              <div className="mt-4 rounded-[20px] overflow-hidden border-2 border-black max-w-xs">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center w-[122px] h-[54px] bg-green rounded-pill border-[5px] border-black shadow-card hover:bg-green/90 active:scale-95 transition-all disabled:opacity-50"
            >
              <ArrowRight className="w-8 h-8 text-white stroke-[3]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
