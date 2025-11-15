"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") || "farmer";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = async (data: LoginFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store user type in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("userType", userType);
      sessionStorage.setItem("userName", data.name);
    }

    // Redirect based on user type
    if (userType === "farmer") {
      router.push("/dashboard");
    } else {
      router.push("/marketplace");
    }
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="mb-12 bg-yellow rounded-[36.5px] border-2 border-black shadow-card py-6 flex items-center justify-center">
            <h1 className="text-4xl font-mukta font-extrabold text-brown">
              {t("title")}
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t("name")}
              required
              placeholder="....."
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label={t("password")}
              type="password"
              required
              placeholder="....."
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-brown hover:underline font-mukta"
              >
                {t("forgotPassword")}
              </button>
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
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-2xl font-mukta text-brown">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
