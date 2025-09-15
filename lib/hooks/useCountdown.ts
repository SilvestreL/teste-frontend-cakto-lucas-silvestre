"use client";

import { useState, useEffect } from "react";

interface CountdownTime {
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSecondsLeft: number;
}

export function useCountdown(initialMinutes: number = 10): CountdownTime {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft === 0;
  const totalSecondsLeft = timeLeft;

  return { minutes, seconds, isExpired, totalSecondsLeft };
}
