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
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = (searchParams.get("type") || "farmer") as "farmer" | "industry";

  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>("");

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
    try {
      setError("");

      if (isSignUp) {
        // Sign up new user
        await signUpWithEmail(
          data.email,
          data.password,
          data.name || "User",
          userType
        );
      } else {
        // Sign in existing user
        await signInWithEmail(data.email, data.password);
      }

      // Redirect based on user type
      if (userType === "farmer") {
        router.push("/dashboard");
      } else {
        router.push("/marketplace");
      }
    } catch (err: any) {
      console.error("Authentication error:", err);

      // User-friendly error messages
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Please sign in instead.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found. Please sign up first.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Authentication failed. Please try again.");
      }
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
            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-100 border-2 border-red-500 rounded-xl">
                <p className="text-sm text-red-700 font-mukta">{error}</p>
              </div>
            )}

            {/* Name field (only for sign up) */}
            {isSignUp && (
              <Input
                label="Name"
                required
                placeholder="Enter your name"
                {...register("name")}
                error={errors.name?.message}
              />
            )}

            {/* Email field */}
            <Input
              label="Email"
              type="email"
              required
              placeholder="your.email@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label={t("password")}
              type="password"
              required
              placeholder="At least 6 characters"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Toggle Sign In / Sign Up */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-green hover:underline font-mukta font-semibold"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>

              {!isSignUp && (
                <button
                  type="button"
                  className="text-sm text-brown hover:underline font-mukta"
                >
                  {t("forgotPassword")}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center w-[122px] h-[54px] bg-green rounded-pill border-[5px] border-black shadow-card hover:bg-green/90 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-8 h-8 text-white stroke-[3]" />
                )}
              </button>
            </div>

            {/* User Type Indicator */}
            <div className="text-center pt-2">
              <p className="text-sm text-brown/60 font-mukta">
                Signing {isSignUp ? "up" : "in"} as <span className="font-bold capitalize">{userType}</span>
              </p>
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
