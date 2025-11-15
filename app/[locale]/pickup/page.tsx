"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, Upload, MapPin, Camera } from "lucide-react";
import { uploadWasteImage } from "@/lib/storage";
import { createWasteBatch } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

const pickupSchema = z.object({
  wasteType: z.string().min(1, "Please enter waste type"),
  quantityKg: z.number().min(1, "Quantity must be at least 1 kg"),
  moistureLevel: z.string().optional(),
  season: z.string().min(1, "Please select season"),
});

type PickupFormData = z.infer<typeof pickupSchema>;

export default function PickupPage() {
  const t = useTranslations("pickupForm");
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationSource, setLocationSource] = useState<"gps" | "fallback" | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const LUDHIANA_COORDS = { lat: 30.901, lng: 75.8573 };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PickupFormData>({
    resolver: zodResolver(pickupSchema),
  });

  const handleBack = () => {
    router.back();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationSource("gps");
        setLocationLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not get location. Using default (Ludhiana, Punjab)");
        // Fallback to Ludhiana center coordinates
        setLocation(LUDHIANA_COORDS);
        setLocationSource("fallback");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleUseFarmLocation = () => {
    setLocation(LUDHIANA_COORDS);
    setLocationSource("fallback");
    setError("");
  };

  const onSubmit = async (data: PickupFormData) => {
    try {
      setError("");

      // Validation checks
      if (!user) {
        setError("You must be logged in to submit waste");
        router.push("/login?type=farmer");
        return;
      }

      if (!photoFile) {
        setError("Please upload a photo of the waste");
        return;
      }

      if (!location) {
        setError("Please enable location services");
        return;
      }

      setUploading(true);

      // Upload photo to Firebase Storage
      const photoUrl = await uploadWasteImage(photoFile, user.uid);

      // Create waste batch in Firestore
      const batchId = await createWasteBatch({
        farmerId: user.uid,
        farmerName: user.displayName || "Farmer",
        wasteType: data.wasteType,
        quantityKg: data.quantityKg,
        moistureLevel: data.moistureLevel || "Standard",
        season: data.season,
        location: {
          lat: location.lat,
          lng: location.lng,
          city: "Ludhiana",
          state: "Punjab",
          district: "Ludhiana",
        },
        photoUrl,
        status: "pending",
        region: "Punjab",
        district: "Ludhiana",
        state: "Punjab",
        country: "India",
      });

      console.log("Waste batch created:", batchId);

      // Redirect to confirmation page
      router.push("/confirmation");
    } catch (err: any) {
      console.error("Error submitting waste:", err);
      setError(err.message || "Failed to submit waste. Please try again.");
    } finally {
      setUploading(false);
    }
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
      <div className="relative z-10 pt-20 px-6 max-w-md mx-auto">
        {/* Title Banner */}
        <div className="mb-8 bg-yellow rounded-[36px] border-2 border-black shadow-card py-4 flex items-center justify-center">
          <h1 className="text-2xl font-mukta font-extrabold text-brown">
            Submit Waste for Pickup
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-xl">
            <p className="text-sm text-red-700 font-mukta">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Waste Type */}
          <div>
            <label className="block text-lg font-mukta font-semibold text-brown mb-2">
              Waste Type
              <span className="text-red ml-1">*</span>
            </label>
            <select
              {...register("wasteType")}
              className="flex w-full rounded-input border border-black bg-cream-light px-5 py-3 text-lg font-inter text-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            >
              <option value="">Select waste type...</option>
              <option value="Rice Straw">Rice Straw</option>
              <option value="Wheat Residue">Wheat Residue</option>
              <option value="Mustard Stalks">Mustard Stalks</option>
              <option value="Cotton Stalks">Cotton Stalks</option>
              <option value="Sugarcane Bagasse">Sugarcane Bagasse</option>
              <option value="Corn Stalks">Corn Stalks</option>
              <option value="Other">Other</option>
            </select>
            {errors.wasteType && (
              <p className="mt-1 text-sm text-red">{errors.wasteType.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-lg font-mukta font-semibold text-brown mb-2">
              Quantity (kg)
              <span className="text-red ml-1">*</span>
            </label>
            <input
              type="number"
              {...register("quantityKg", { valueAsNumber: true })}
              placeholder="e.g., 500"
              className="flex w-full rounded-input border border-black bg-cream-light px-5 py-3 text-lg font-inter text-brown placeholder:text-brown/40 placeholder:font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            />
            {errors.quantityKg && (
              <p className="mt-1 text-sm text-red">{errors.quantityKg.message}</p>
            )}
          </div>

          {/* Season */}
          <div>
            <label className="block text-lg font-mukta font-semibold text-brown mb-2">
              Season
              <span className="text-red ml-1">*</span>
            </label>
            <select
              {...register("season")}
              className="flex w-full rounded-input border border-black bg-cream-light px-5 py-3 text-lg font-inter text-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            >
              <option value="">Select season...</option>
              <option value="Rabi">Rabi (Winter)</option>
              <option value="Kharif">Kharif (Monsoon)</option>
              <option value="Zaid">Zaid (Summer)</option>
            </select>
            {errors.season && (
              <p className="mt-1 text-sm text-red">{errors.season.message}</p>
            )}
          </div>

          {/* Moisture Level (Optional) */}
          <div>
            <label className="block text-lg font-mukta font-semibold text-brown mb-2">
              Moisture Level (Optional)
            </label>
            <select
              {...register("moistureLevel")}
              className="flex w-full rounded-input border border-black bg-cream-light px-5 py-3 text-lg font-inter text-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 h-[52px]"
            >
              <option value="">Select moisture level...</option>
              <option value="Low (<10%)">Low (&lt;10%)</option>
              <option value="Medium (10-20%)">Medium (10-20%)</option>
              <option value="High (>20%)">High (&gt;20%)</option>
            </select>
          </div>

          {/* Location Capture */}
          <div>
            <label className="block text-lg font-mukta font-semibold text-brown mb-2">
              Location
              <span className="text-red ml-1">*</span>
            </label>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className={`w-full flex items-center justify-center gap-3 rounded-input border border-black px-5 py-3 text-lg font-mukta h-[55px] transition-all ${
                  location && locationSource === "gps"
                    ? "bg-green text-white"
                    : "bg-yellow text-brown hover:bg-yellow/90"
                } ${locationLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <MapPin className="w-5 h-5" />
                {locationLoading
                  ? "Getting Location..."
                  : location && locationSource === "gps"
                  ? `Location Captured ✓ (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
                  : "Get Current Location"}
              </button>
              <button
                type="button"
                onClick={handleUseFarmLocation}
                className={`w-full flex items-center justify-center gap-2 rounded-input border border-dashed border-brown px-5 py-3 text-base font-mukta h-[52px] transition-all ${
                  location && locationSource === "fallback"
                    ? "bg-green/90 text-white"
                    : "bg-white text-brown hover:bg-cream-light"
                }`}
              >
                <MapPin className="w-5 h-5" />
                Use Ludhiana Farm Location
              </button>
            </div>
            <p className="mt-2 text-sm text-brown/60 font-mukta">
              {location
                ? locationSource === "gps"
                  ? "GPS captured from your current device position."
                  : "Using the Ludhiana farm hub coordinates (30.9010, 75.8573). Ideal when traveling outside Punjab."
                : "Tap one of the buttons to capture your GPS or use the Ludhiana farm hub fallback."}
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-lg font-mukta font-semibold text-brown mb-2">
              Waste Photo
              <span className="text-red ml-1">*</span>
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-between w-full rounded-input border border-black bg-cream-light px-5 py-3 text-lg font-mukta text-brown cursor-pointer hover:bg-cream-light/80 h-[55px]"
              >
                <span className={photoPreview ? "text-green" : "text-brown/60"}>
                  {photoPreview ? "Photo uploaded ✓" : "Upload / Take Photo"}
                </span>
                <Camera className="w-6 h-6 text-brown" />
              </label>
            </div>
            {photoPreview && (
              <div className="mt-4 rounded-[20px] overflow-hidden border-2 border-black max-w-xs">
                <img src={photoPreview} alt="Preview" className="w-full h-auto" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoFile(null);
                  }}
                  className="w-full bg-red text-white py-2 font-mukta hover:bg-red/90"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="flex items-center justify-center w-[122px] h-[54px] bg-green rounded-pill border-[5px] border-black shadow-card hover:bg-green/90 active:scale-95 transition-all disabled:opacity-50"
            >
              {uploading || isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-8 h-8 text-white stroke-[3]" />
              )}
            </button>
          </div>

          {uploading && (
            <div className="text-center">
              <p className="text-sm font-mukta text-brown/70">
                Uploading waste details and matching with AI...
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Force dynamic rendering for PWA
export const dynamic = "force-dynamic";
