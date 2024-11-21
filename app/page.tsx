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
  const [isAuth, setIsAuth] = useState(false);
  const [authInput, setAuthInput] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
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

  return !isAuth ? (
    <div
      className="w-screen flex items-center justify-center flex-col gap-12"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="text-5xl font-semibold">인증 코드를 입력해주세요.</div>
      <div className="flex flex-col gap-4 items-center">
        <input
          className="w-[520px] h-16 text-4xl font-semibold border-b-2 border-neutral-700 text-black"
          onChange={(e) => {
            setAuthInput(e.target.value);
            setIsAuthError(false);
          }}
        />

        {isAuthError && (
          <div className="text-red-500 text-2xl font-semibold">
            인증 코드가 일치하지 않습니다.
          </div>
        )}
      </div>
      <div
        className="w-[520px] h-16 text-4xl font-semibold rounded-[18px] flex items-center justify-center border-neutral-700 bg-[#90FF67] text-black cursor"
        onClick={() => {
          const authentication =
            authInput === process.env.NEXT_PUBLIC_MAIN_CODE;
          if (authentication) {
            setIsAuth(true);
          } else {
            setIsAuthError(true);
          }
        }}
      >
        확인
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col w-full relative"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div
        className="absolute top-0 right-0 flex gap-20 z-50"
        style={{
          height: "calc(100vh - 64px - 80px)",
        }}
      >
        <ProcessImage
          currentProcess={currentProcess}
          isSelectedImage={isSelectedImage}
        />
        <div className="flex flex-col mt-[64px] mr-[100px] mb-[40px] justify-between">
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[1, 18]}
            imgName="LPB"
            text="준비실"
            width={160}
            height={71}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[1, 10, 18]}
            imgName="PF"
            text="공급설비"
            width={160}
            height={71}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[3, 18]}
            imgName="MCC"
            text="통제실"
            width={160}
            height={71}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[18]}
            imgName="MAO"
            text="지원실"
            width={160}
            height={71}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[9, 18]}
            imgName="AR"
            text="안테나 룸"
            width={100}
            height={120}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[12, 17]}
            imgName="sea"
            text="해상 통제"
            width={120}
            height={120}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[11, 17]}
            imgName="fire"
            text="소방"
            width={120}
            height={120}
            isActive={isSelectedImage}
          />
          <ProcessInfo
            currentProcess={currentProcess}
            processNumbers={[13]}
            imgName="police"
            text="경찰"
            width={120}
            height={120}
            isActive={isSelectedImage}
          />
        </div>
      </div>
      <div className="flex flex-col items-start pb-12 pl-[76px] pt-[126px] relative z-10  flex-1">
        <div className="text-[28px] font-medium">UNA EXPRESS - I</div>
        <div className="text-[60px] font-semibold">
          우나 익스프레스 1호기 발사 캠페인​
        </div>
        <div className="flex gap-[68px] flex-col md:flex-row mt-[60px]">
          <div>
            <div className="text-[40px] font-semibold">발사 예정 시각</div>
            <div className="text-5xl mt-[30px]">
              <TimeBox time={launchTime} />
            </div>
          </div>
          <div className="">
            <div className="text-[40px] font-semibold">발사까지 남은시간</div>
            <div className="text-5xl mt-[30px]">
              <Timer startTime={launchTime} />
            </div>
          </div>
        </div>
        <div
          className="flex flex-col gap-2 mt-[78px] overflow-hidden"
          style={{
            height: "calc(100vh - 870px)",
          }}
        >
          {[...allProcesses]
            .slice(Math.max(0, currentProcess - 1))
            .map((process, index) => (
              <div
                key={`process-${index}`}
                className={clsx(
                  "h-[88px] w-[1000px] flex-shrink-0 font-semibold pr-20 text-[40px] flex items-center justify-start pl-[40px] rounded-[18px]",
                  {
                    "text-[#212121]": index !== 1,
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
  isActive,
}: {
  currentProcess: number;
  processNumbers: number[];
  imgName: string;
  text: string;
  width: number;
  height: number;
  isActive: boolean;
}) {
  return (
    <div className="flex w-[360px] justify-between h-[120px] items-center">
      <div
        className={clsx(
          "text-[35px] font-semibold flex flex-col items-start justify-center",
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
      <div className="w-[160px] flex justify-start items-start">
        <Image
          src={`/${imgName}${
            processNumbers.includes(currentProcess) && isActive
              ? "_selected"
              : ""
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
    const hasSelectedImage = [2, 4, 5, 6, 7, 8, 9, 10, 15, 16, 18].includes(
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
