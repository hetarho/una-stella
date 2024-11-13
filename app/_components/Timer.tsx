"use client";

import { useEffect, useState } from "react";
import TimeBox from "./TimeBox";

export default function Timer({ startTime }: { startTime: Date | undefined }) {
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    const setTime = () => {
      const now = new Date();
      const difference = (startTime?.getTime() ?? now.getTime() )- now.getTime();

      // 남은 시간이 없으면 "0:00:00" 반환
      if (difference <= 0) {
        return "0:00:00";
      }

      // 시간, 분, 초 계산
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setHours(hours.toString().padStart(2, "0"));
      setMinutes(minutes.toString().padStart(2, "0"));
      setSeconds(seconds.toString().padStart(2, "0"));
    };

    const interval = setInterval(() => {
      setTime();
    }, 1000);

    // 초기값 설정
    setTime();

    return () => clearInterval(interval);
  }, [startTime]);

  return <TimeBox hours={hours} minutes={minutes} seconds={seconds} showT />;
}
