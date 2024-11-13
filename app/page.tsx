"use client";

import clsx from "clsx";
import Timer from "./_components/Timer";
import { useEffect, useState } from "react";
import Image from "next/image";
import TimeBox from "./_components/TimeBox";
import allProcesses from "./_constant/allProcess";
import ProcessNumber from "./_components/ProcessNumber";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { utcToKst } from "./utils/time";

export default function Home() {
  const [launchTime, setLaunchTime] = useState<Date>();
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(1);

  // const fetchLaunchTime = async () => {
  //   try {
  //     const res = await fetch("/api/launchTime");
  //     const data: { time: Date } = await res.json();
  //     const utcDate = new Date(data.time);
  //     setLaunchTime(utcDate);
  //   } catch (error) {
  //     console.error("Error fetching launch time:", error);
  //   }
  // };

  // const fetchCurrentProcess = async () => {
  //   const res = await fetch("/api/process");
  //   const data: { current: number } = await res.json();
  //   setCurrentProcess(data.current);
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSelectedImage((prev) => !prev);
    }, 400);

    // Firestore 문서 참조 생성
    const launchTimeRef = doc(db, "launch", "1");
    const processRef = doc(db, "process", "1");

    // 실시간 리스너 설정
    const launchTimeUnsubscribe = onSnapshot(
      launchTimeRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const utcDate = new Date(snapshot.data().time.toDate());
          const kstDate = utcToKst(utcDate);
          setLaunchTime(kstDate);
        }
      }
    );

    const processUnsubscribe = onSnapshot(
      processRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCurrentProcess(snapshot.data().current);
        }
      }
    );

    // Clean up
    return () => {
      clearInterval(interval);
      launchTimeUnsubscribe();
      processUnsubscribe();
    };
  }, []);

  return (
    <div
      className="flex flex-col w-full relative"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="absolute top-0 right-0 h-full">
        <Image
          src={isSelectedImage ? "/rocket.png" : "/rocket_selected.png"}
          alt="Background"
          width={810}
          height={1036}
          className="-z-10"
          style={{
            objectFit: "contain",
            width: "auto",
            height: "100%",
          }}
        />
      </div>
      <div className="flex flex-1 flex-col items-start pb-12 pl-[76px] pt-[126px] relative z-10">
        <div className="text-[20px] font-medium">UNA EXPRESS - 1</div>
        <div className="text-[50px] font-semibold">
          우나 익스프레스 1호기 발사 캠페인​
        </div>
        <div className="flex gap-[68px] flex-col md:flex-row mt-[60px]">
          <div>
            <div className="text-[30px] font-semibold">발사 예정시간</div>
            <div className="text-5xl mt-[30px]">
              <TimeBox time={launchTime} />
            </div>
          </div>
          <div className="">
            <div className="text-[30px] font-semibold">발사까지 남은시간</div>
            <div className="text-5xl mt-[30px]">
              <Timer startTime={launchTime} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-[78px]">
          {[...allProcesses]
            .slice(Math.max(0, currentProcess - 1), currentProcess + 2)
            .map((process, index) => (
              <div
                key={process}
                className={clsx(
                  "text-lg h-[80px] w-[747px] flex-shrink-0 font-semibold pr-20 text-[38px] flex items-center justify-start pl-[40px] rounded-[18px]",
                  {
                    "opacity-50": index !== 1,
                    "bg-[#90FF67] text-black": index === 1,
                  }
                )}
              >
                {process === "" ? (
                  <div></div>
                ) : (
                  `${String(index + currentProcess - 1).padStart(
                    2,
                    "0"
                  )}. ${process}`
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="mb-9 mx-9 flex justify-between relative items-center">
        <div className="absolute bg-[#2A471C] w-full h-[1px]"></div>
        {[...allProcesses].slice(1, 19).map((process, index) => (
          <ProcessNumber
            key={`process-number-${index}`}
            number={index + 1}
            isPassed={index < currentProcess}
          />
        ))}
      </div>
    </div>
  );
}
