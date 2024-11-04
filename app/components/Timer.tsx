"use client";

import { useEffect, useState } from "react";

export default function Timer({ startTime }: { startTime: Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = startTime.getTime() - now.getTime();

      // 남은 시간이 없으면 "0:00:00" 반환
      if (difference <= 0) {
        return "0:00:00";
      }

      // 시간, 분, 초 계산
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // 시:분:초 형식으로 포맷팅
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // 초기값 설정
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(interval);
  }, [startTime]);

  return <div>T -{timeLeft}</div>;
}
