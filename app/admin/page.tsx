"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import allProcesses from "../_constant/allProcess";
import clsx from "clsx";

export default function AdminPage() {
  const [launchTime, setLaunchTime] = useState<Date>(new Date());
  const [currentProcess, setCurrentProcess] = useState(0);

  const [initialInputYear, setInitialInputYear] = useState("");
  const [initialInputMonth, setInitialInputMonth] = useState("");
  const [initialInputDay, setInitialInputDay] = useState("");
  const [initialInputHours, setInitialInputHours] = useState("");
  const [initialInputMinutes, setInitialInputMinutes] = useState("");
  const [initialInputSeconds, setInitialInputSeconds] = useState("");

  const [currentInputYear, setCurrentInputYear] = useState("");
  const [currentInputMonth, setCurrentInputMonth] = useState("");
  const [currentInputDay, setCurrentInputDay] = useState("");
  const [currentInputHours, setCurrentInputHours] = useState("");
  const [currentInputMinutes, setCurrentInputMinutes] = useState("");
  const [currentInputSeconds, setCurrentInputSeconds] = useState("");

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

  const handleInputLaunchTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = e;
    console.log(value);
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
    const sec = String(date.getSeconds()).padStart(2, "0");

    const now = new Date();
    const difference = date.getTime() - now.getTime();

    // 시간, 분, 초 계산
    const leftHours = Math.floor(difference / (1000 * 60 * 60));
    const leftMinutes = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const leftSeconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      year,
      month,
      day,
      hours,
      minutes,
      sec,
      leftHours,
      leftMinutes,
      leftSeconds,
    };
  };

  useEffect(() => {
    const {
      day,
      hours,
      minutes,
      month,
      sec,
      year,
      leftHours,
      leftMinutes,
      leftSeconds,
    } = formatDateTimeLocal(launchTime);

    setInitialInputYear(`${year}`);
    setInitialInputMonth(`${month}`);
    setInitialInputDay(`${day}`);
    setInitialInputHours(`${hours}`);
    setInitialInputMinutes(`${minutes}`);
    setInitialInputSeconds(`${sec}`);
  }, [launchTime]);

  function handleInputHours(value: string) {
    setCurrentInputHours(value);
  }

  function handleInputMinutes(value: string) {
    setCurrentInputMinutes(value);
  }

  function handleInputSeconds(value: string) {
    setCurrentInputSeconds(value);
  }

  return (
    <div
      className="flex flex-col gap-20 p-4 w-full items-center pt-20"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="text-5xl font-semibold">콘솔창</div>
      <div className="flex flex-col gap-8 items-center">
        <div className="flex gap-2 items-center justify-center">
          <div className="font-semibold text-2xl w-48">발사 예정 시각</div>
          <Selector
            min={2024}
            max={2025}
            onChange={handleInputHours}
            initialValue={initialInputYear}
          />
          <div className="text-2xl mr-2">년</div>
          <Selector
            min={1}
            max={12}
            onChange={handleInputHours}
            initialValue={initialInputMonth}
          />
          <div className="text-2xl mr-2">월</div>
          <Selector
            min={0}
            max={31}
            onChange={handleInputHours}
            initialValue={initialInputDay}
          />
          <div className="text-2xl mr-2">일</div>
          <Selector
            min={0}
            max={23}
            onChange={handleInputHours}
            initialValue={initialInputHours}
          />
          <div className="text-2xl mr-2">시</div>
          <Selector
            min={0}
            max={59}
            onChange={handleInputMinutes}
            initialValue={initialInputMinutes}
          />
          <div className="text-2xl mr-2">분</div>
          <Selector
            min={0}
            max={59}
            onChange={handleInputSeconds}
            initialValue={initialInputSeconds}
          />
          <div className="text-2xl mr-2">초</div>
        </div>
        <div className="flex gap-4 items-center justify-center">
          <div className="font-semibold text-2xl w-48">발사까지 남은 시간</div>
          <input
            className="rounded-md p-2 text-black outline-none text-2xl"
            onChange={handleInputLaunchTimeChange}
          />
        </div>
        <button
          className={clsx("font-semibold text-2xl p-2 rounded-md w-full", {
            "bg-[#90FF67] text-black":
              currentInputYear !== initialInputYear ||
              currentInputMonth !== initialInputMonth ||
              currentInputDay !== initialInputDay ||
              currentInputHours !== initialInputHours ||
              currentInputMinutes !== initialInputMinutes ||
              currentInputSeconds !== initialInputSeconds,
            "bg-neutral-700":
              currentInputYear === initialInputYear &&
              currentInputMonth === initialInputMonth &&
              currentInputDay === initialInputDay &&
              currentInputHours === initialInputHours &&
              currentInputMinutes === initialInputMinutes &&
              currentInputSeconds === initialInputSeconds,
          })}
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

function Selector({
  min,
  max,
  onChange,
  initialValue,
}: {
  min: number;
  max: number;
  onChange: (value: string) => void;
  initialValue: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 56; // 각 항목의 높이를 지정
  const [selectedValue, setSelectedValue] = useState(initialValue);

  useEffect(() => {
    if (!containerRef.current) return;

    const selectedIndex = parseInt(initialValue) - min;
    containerRef.current.scrollTo({
      top: selectedIndex * itemHeight,
    });
    setSelectedValue(initialValue);
  }, [initialValue, min]);

  // 스크롤이 멈춘 후 선택된 요소를 업데이트하는 함수
  const handleScrollEnd = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);
    const selectedValue = min + selectedIndex;

    setSelectedValue(selectedValue.toString());

    // 부모 컴포넌트로 선택된 값 전달
    onChange(selectedValue.toString());

    // 선택된 요소를 중앙으로 맞추기
    containerRef.current.scrollTo({
      top: selectedIndex * itemHeight,
      behavior: "smooth",
    });
  }, [min, onChange, itemHeight]);

  // 스크롤 이벤트 핸들러 설정
  useEffect(() => {
    const container = containerRef.current;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150); // 스크롤이 멈춘 후 실행
    };

    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [handleScrollEnd]);

  return (
    <div
      className={clsx("overflow-hidden", {
        "w-12": initialValue.length !== 4,
        "w-16": initialValue.length === 4,
      })}
    >
      <div
        ref={containerRef}
        className={clsx("overflow-y-scroll h-64 ", {
          "w-20": initialValue.length !== 4,
          "w-24": initialValue.length === 4,
        })}
      >
        {/* 빈 공간 추가로 중앙 정렬 보정 */}
        <div className="h-24"></div>
        {[...Array(max - min + 1)].map((_, index) => (
          <div
            key={`selector-${index}`}
            className={clsx(
              "font-bold text-2xl text-center h-10 flex items-center justify-center pr-4",
              {
                "bg-[#90FF67] text-black":
                  selectedValue === (min + index).toString(),
                "opacity-50":
                  Math.abs(parseInt(selectedValue) - min - index) === 1,
                "opacity-20":
                  Math.abs(parseInt(selectedValue) - min - index) === 2,
              }
            )}
            style={{ height: itemHeight }}
          >
            {min + index}
          </div>
        ))}
        <div className="h-28"></div>
      </div>
    </div>
  );
}
