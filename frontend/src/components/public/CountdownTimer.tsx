"use client";
import React, { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate = "2026-09-04T00:00:00" }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isCompleted: false,
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isCompleted) {
    return (
      <div className="inline-flex items-center px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-hindi font-bold">
        🎉 श्री कृष्ण जन्माष्टमी महोत्सव प्रारंभ हो चुका है! दर्शन एवं प्रसाद हेतु पधारें।
      </div>
    );
  }

  const timeBlocks = [
    { label: "दिन (Days)", value: timeLeft.days },
    { label: "घंटे (Hours)", value: timeLeft.hours },
    { label: "मिनट (Mins)", value: timeLeft.minutes },
    { label: "सेकंड (Secs)", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {timeBlocks.map((block, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-[#0B1D3A]/90 border border-amber-500/40 shadow-lg shadow-amber-500/10 backdrop-blur-sm"
        >
          <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-300 font-hindi mt-1">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
