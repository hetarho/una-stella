"use client";

import clsx from "clsx";
import Timer from "./components/Timer";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "@/firebaseConfig";
import Image from "next/image";
import TimeBox from "./components/TimeBox";

export default function Home() {
  const [launchTime, setLaunchTime] = useState<Date>();
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(1);

  useEffect(() => {
    const fetchLaunchTime = async () => {
      try {
        const docRef = doc(db, "launch", "1");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const utcDate = docSnap.data().time.toDate();
          const kstDate = new Date(utcDate.getTime());
          setLaunchTime(kstDate);
        }
      } catch (error) {
        console.error("Error fetching launch time:", error);
      }
    };

    const interval = setInterval(() => {
      setIsSelectedImage((prev) => !prev);
    }, 400);

    fetchLaunchTime();

    return () => clearInterval(interval);
  }, []);

  const allProcesses = [
    "",
    "발사 기반 시설 준비",
    "발사 시스템 운용 기초 준비",
    "항공전자 및 페이로드 시스템 준비",
    "온보드 벨브 작동용 고압 헬륨 탱크 충전",
    "추진제 탱크 가압용 고압 헬륨 탱크 충전",
    "점화용 기체 메탄 앰퓰 탱크 충전",
    "점화용 기체 산소 앰퓰 탱크 충전",
    "연료 주입(케로신)",
    "텔레메트리 점검(S-Band, UHf)",
    "해상 통제 시작",
    "산불 방지용 발사장 대량 살수 작업",
    "육상 통제 시작",
    "발사 운용 모드 전환",
    "발사대 기립",
    "산화제 주입 (엑체 산소)",
    "발사 자동 시퀀스 및 발사",
    "발사 자동 종료 및 이상 유무 확인",
    "발사 기반 설비 초기화 및 종료",
    "",
  ];
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
              <TimeBox time={launchTime ?? new Date()} />
            </div>
          </div>
          <div className="">
            <div className="text-[30px] font-semibold">발사까지 남은시간</div>
            <div className="text-5xl mt-[30px]">
              <Timer startTime={launchTime ?? new Date()} />
            </div>
          </div>
        </div>
        <div
          className="flex flex-col gap-2 mt-[78px]"
          onClick={() => {
            setCurrentProcess((prev) => (prev + 1 > 18 ? 1 : prev + 1));
          }}
        >
          {[...allProcesses]
            .slice(Math.max(0, currentProcess - 1), currentProcess + 2)
            .map((process, index) => (
              <div
                key={process}
                className={clsx(
                  "text-lg h-[80px] flex-shrink-0 font-semibold w-fit pr-20 text-[38px] flex items-center justify-start pl-[40px] rounded-[18px]",
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
    </div>
  );
}
