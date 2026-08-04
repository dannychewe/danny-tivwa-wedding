"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

type TimeLeft = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function getTimeLeft(targetDate: string): TimeLeft {
  const distance = new Date(targetDate).getTime() - Date.now();

  if (distance <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00"
    };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const items = useMemo(
    () => [
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Min", value: timeLeft.minutes },
      { label: "Sec", value: timeLeft.seconds }
    ],
    [timeLeft]
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="card-surface min-w-0 rounded-[1.5rem] border-white/50 px-3 py-4 text-center sm:px-4 sm:py-5"
        >
          <div className="text-2xl font-semibold leading-none text-ink sm:text-4xl">{item.value}</div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink/55 sm:text-xs sm:tracking-[0.3em]">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

