"use client";

import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";
import { useAppPreferences } from "@/components/app-preferences-provider";

const TESTIMONIALS = [
  {
    author: "Tama Brown",
    quote:
      "My first order arrived today in perfect condition. From the time I sent a question about the item to making the purchase, to the shipping and now the delivery, your company, Tecs, has stayed in touch. Such great service. I look forward to shopping on your site in the future and would highly recommend it.",
  },
  {
    author: "James Wilson",
    quote:
      "Excellent communication from start to finish. The website was easy to use, delivery was quick, and the product arrived exactly as described. I will definitely be ordering again.",
  },
  {
    author: "Sarah Miller",
    quote:
      "I was impressed by how fast the support team responded. They answered all of my questions, helped me choose the right product, and the entire buying experience felt smooth and professional.",
  },
  {
    author: "Daniel Carter",
    quote:
      "Fantastic service and great prices. Everything from checkout to delivery was seamless. It is rare to find a shop that keeps you updated so well at every step of the process.",
  },
] as const;

const AUTO_DELAY_MS = 3000;
const FADE_DURATION_MS = 260;

export function TestimonialSlider() {
  const { t } = useAppPreferences();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  function scheduleAutoPlay() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      goToIndex((activeIndex + 1) % TESTIMONIALS.length, "next");
    }, AUTO_DELAY_MS);
  }

  function goToIndex(nextIndex: number, nextDirection: "next" | "prev") {
    if (nextIndex === activeIndex && isVisible) {
      return;
    }

    setDirection(nextDirection);
    setIsVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsVisible(true);
    }, FADE_DURATION_MS);
  }

  function handleDotClick(index: number) {
    goToIndex(index, index > activeIndex ? "next" : "prev");
    scheduleAutoPlay();
  }

  useEffect(() => {
    scheduleAutoPlay();

    return () => {
      clearTimers();
    };
  }, [activeIndex]);

  const activeItem = TESTIMONIALS[activeIndex];

  return (
    <div className="mx-auto rounded-sm bg-[#f5f7ff] px-20 py-10" style={{ maxWidth: "830px" }}>
      <div className="flex gap-6">
        <Quote className="mt-1 h-8 w-8 shrink-0 fill-black text-black" />

        <div className="flex-1 overflow-hidden">
          <div
            className={`transition-all duration-300 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : direction === "next"
                  ? "translate-x-4 opacity-0"
                  : "-translate-x-4 opacity-0"
            }`}
          >
            <p className="text-[18px] leading-[1.55] tracking-[-0.01em] text-[#272560]" style={{ maxWidth: "640px" }}>
              {activeItem.quote}
            </p>
            <p className="mt-5 text-right text-[14px] font-medium text-[#272560]">- {activeItem.author}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-6">
        <button className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border-2 border-[#0156ff] px-7 text-[14px] font-semibold text-[#0156ff] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0156ff] hover:text-white hover:shadow-[0_10px_24px_rgba(1,86,255,0.22)] active:scale-[0.98]">
          {t("testimonial.leaveReview")}
        </button>

        <div className="flex items-center gap-2.5">
          {TESTIMONIALS.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.author}
                type="button"
                aria-label={`Show testimonial ${index + 1}`}
                onClick={() => handleDotClick(index)}
                className={`h-4 w-4 cursor-pointer rounded-full transition-all duration-300 ${
                  isActive
                    ? "scale-110 bg-[#0156ff] shadow-[0_0_0_4px_rgba(1,86,255,0.12)]"
                    : "bg-[#cfd6e6] hover:scale-105 hover:bg-[#9dadcf]"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
