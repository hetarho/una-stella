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
  const [currentProcess, setCurrentProcess] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSelectedImage((prev) => !prev);
    }, 400);

    // Firestore 문서 참조 생성
    const launchTimeRef = doc(db, "launch", "1");
    const processRef = doc(db, "process", "1");

    // 실시간 리스너 설정
    const launchTimeUnsubscribe = onSnapshot(launchTimeRef, (snapshot) => {
      if (snapshot.exists()) {
        const utcDate = new Date(snapshot.data().time.toDate());
        const kstDate = utcToKst(utcDate);
        setLaunchTime(kstDate);
      }
    });

    const processUnsubscribe = onSnapshot(processRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentProcess(snapshot.data().current);
      }
    });

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
      <div
        className="absolute top-0 right-0 flex"
        style={{
          height: "calc(100vh - 64px - 80px)",
        }}
      >
        <ProcessImage
          currentProcess={currentProcess}
          isSelectedImage={isSelectedImage}
        />
        <div className="flex flex-col gap-[26px] mt-[127px] mr-[26px]">
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[1, 18]}
            imgName="LPB"
            text="준비실"
            width={147}
            height={66}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[1, 13, 18]}
            imgName="PF"
            text="추진제<br>공급설비"
            width={147}
            height={66}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[2, 18]}
            imgName="MCC"
            text="통제실"
            width={147}
            height={66}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[18]}
            imgName="MAO"
            text="지원실"
            width={147}
            height={66}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[9, 18]}
            imgName="AR"
            text="안테나 룸"
            width={63}
            height={82}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[10, 17]}
            imgName="sea"
            text="해양"
            width={84}
            height={84}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[11, 17]}
            imgName="fire"
            text="소방"
            width={84}
            height={84}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[12]}
            imgName="police"
            text="경찰"
            width={84}
            height={84}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col items-start pb-12 pl-[76px] pt-[126px] relative z-10">
        <div className="text-[20px] font-medium">UNA EXPRESS - 1</div>
        <div className="text-[50px] font-semibold">
          우나 익스프레스 1호기 발사 캠페인​
        </div>
        <div className="flex gap-[68px] flex-col md:flex-row mt-[60px]">
          <div>
            <div className="text-[30px] font-semibold">발사 예정 시각</div>
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

function ProcessInfo({
  currentProcess,
  processNumbers,
  imgName,
  text,
  width,
  height,
}: {
  currentProcess: number;
  processNumbers: number[];
  imgName: string;
  text: string;
  width: number;
  height: number;
}) {
  return (
    <div className="flex w-[243px] justify-between">
      <div
        className={clsx(
          "text-[24px] font-semibold flex flex-col items-center justify-center",
          {
            "text-white": !processNumbers.includes(currentProcess),
            "text-[#90FF67]": processNumbers.includes(currentProcess),
          }
        )}
      >
        {text.split("<br>").map((t) => (
          <span
            key={t}
            className="-m-1 flex items-center justify-center h-full"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="w-[147px] flex justify-center">
        <Image
          src={`/${imgName}${
            processNumbers.includes(currentProcess) ? "_selected" : ""
          }.png`}
          alt={text}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}

function ProcessImage({
  currentProcess,
  isSelectedImage,
}: {
  currentProcess: number;
  isSelectedImage: boolean;
}) {
  const [url, setUrl] = useState(`/process_selected${currentProcess}.png`);

  useEffect(() => {
    const hasSelectedImage = [3, 4, 5, 6, 7, 8, 9, 13, 15, 16, 18].includes(
      currentProcess
    );

    let defaultImageNumber;

    if (currentProcess <= 13) {
      defaultImageNumber = 1;
    } else if (currentProcess <= 14) {
      defaultImageNumber = 4;
    } else if (currentProcess <= 16) {
      defaultImageNumber = 2;
    } else {
      defaultImageNumber = 3;
    }

    let url: string;
    if (currentProcess == 14) {
      url = "/process_default4.gif";
    } else {
      url =
        isSelectedImage && hasSelectedImage
          ? `/process_selected${currentProcess}.png`
          : `/process_default${defaultImageNumber}.png`;
    }
    setUrl(url);
  }, [isSelectedImage, currentProcess]);

  return (
    <Image
      src={url}
      alt="Background"
      width={911}
      height={911}
      className="-z-10"
      style={{
        objectFit: "contain",
        width: "auto",
        height: "100%",
      }}
    />
  );
}
