"use client";

import { useEffect, useState } from "react";
import allProcesses from "../_constant/allProcess";
import clsx from "clsx";

export default function AdminPage() {
  const [launchTime, setLaunchTime] = useState<Date>(new Date());
  const [currentProcess, setCurrentProcess] = useState(0);

  const fetchCurrentProcess = async () => {
    const res = await fetch("/api/process");
    const data = await res.json();
    setCurrentProcess(data.current);
  };

  const fetchLaunchTime = async () => {
    const res = await fetch("/api/launchTime");
    const data: { time: Date } = await res.json();
    const utcDate = new Date(data.time);
    setLaunchTime(utcDate);
  };

  useEffect(() => {
    fetchLaunchTime();
    fetchCurrentProcess();
  }, []);

  const handleCurrentProcessClick = async (index: number) => {
    await fetch("/api/process", {
      method: "POST",
      body: JSON.stringify({ current: index }),
    });

    await fetchCurrentProcess();
  };

  const handleLaunchTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLaunchTime(new Date(e.target.value));
  };

  const handleSaveLaunchTime = async () => {
    await fetch("/api/launchTime", {
      method: "POST",
      body: JSON.stringify({
        time: new Date(launchTime.getTime() - 9 * 60 * 60 * 1000),
      }),
    });
  };

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div
      className="flex flex-col gap-20 p-4 w-full items-center pt-20"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="text-5xl font-semibold">콘솔창</div>
      <div className="flex flex-col gap-8 items-center">
        <div className="flex gap-4 items-center justify-center">
          <div className="font-semibold text-2xl ">발사 예정 시간</div>
          <input
            className="rounded-md p-2 text-black outline-none text-2xl"
            type="datetime-local"
            value={formatDateTimeLocal(launchTime)}
            onChange={handleLaunchTimeChange}
          />
        </div>
        <button
          className="bg-[#90FF67] text-black font-semibold text-2xl p-2 rounded-md w-80"
          onClick={handleSaveLaunchTime}
        >
          저장
        </button>
      </div>
      <div className="flex flex-col gap-8 items-center">
        <div className="flex gap-2 items-center text-4xl font-bold">
          전체 프로세스
        </div>
        <div className="flex flex-col gap-6">
          {[...allProcesses].slice(1, 19).map((process, index) => (
            <div
              key={`process-${index}`}
              className="flex gap-4"
              onClick={() => handleCurrentProcessClick(index + 1)}
            >
              <div
                className={clsx(
                  "w-[767px] h-[80px] flex items-center justify-center rounded-[18px] font-semibold text-2xl",
                  {
                    "bg-[#90FF67] text-black ": index === currentProcess - 1,
                    "hover:bg-white hover:bg-opacity-20":
                      index !== currentProcess - 1,
                  }
                )}
              >
                {process}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
