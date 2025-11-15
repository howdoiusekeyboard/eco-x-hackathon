"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function DatePickerPage() {
  const t = useTranslations("datePicker");
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSubmit = () => {
    // Store selected date
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pickupDate", selectedDate.toISOString());
    }
    router.push("/confirmation?type=pickup");
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/", "_blank");
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden pb-20">
      {/* Decorative Ellipses */}
      <div className="absolute top-[331px] left-[-276px] w-[551px] h-[566px] bg-gradient-to-br from-purple/20 to-teal/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[29px] w-[545px] h-[567px] bg-gradient-to-tl from-green/15 to-yellow/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Title Banner */}
          <div className="mb-8 bg-yellow rounded-[36px] border-2 border-black shadow-card py-4 flex items-center justify-center">
            <h1 className="text-2xl font-mukta font-extrabold text-brown">
              {t("title")}
            </h1>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-[20px] border border-gray-200 shadow-card p-4 mb-6">
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ←
              </button>
              <h2 className="text-lg font-inter font-semibold text-brown">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                →
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-inter font-medium text-brown/60 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && handleDayClick(day)}
                  disabled={!day}
                  className={`
                    aspect-square rounded-lg text-sm font-inter
                    ${!day ? "invisible" : ""}
                    ${
                      day === selectedDate.getDate()
                        ? "bg-cream text-brown font-bold border-2 border-brown"
                        : "text-brown hover:bg-gray-100"
                    }
                    ${day === new Date().getDate() && selectedDate.getMonth() === new Date().getMonth() ? "relative" : ""}
                  `}
                >
                  {day}
                  {day === new Date().getDate() &&
                   selectedDate.getMonth() === new Date().getMonth() && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Date Display */}
          <div className="bg-cream-light rounded-input border border-black px-6 py-3 text-center mb-6">
            <p className="text-xl font-inter text-brown">
              {format(selectedDate, "MM/dd/yyyy")}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
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


// Force dynamic rendering for PWA
export const dynamic = 'force-dynamic';
