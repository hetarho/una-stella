import clsx from "clsx";
import Timer from "./components/Timer";
import Image from "next/image";

export default function Home() {
  const allProcesses = [
    "고압 헬륨가스 충전",
    "텔레메트리 작동 확인",
    "케로신 충전",
    "발사대 기립",
    "액체산소 충전",
    "발사 카운트다운",
  ];
  const currentProcess = 3;
  return (
    <div className="relative flex flex-col w-full h-screen sm:pr-[300px] pt-8">
      <div className="absolute right-0 top-0 w-[300px] h-full hidden sm:block">
        <Image
          src="/rocket.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <div className="flex flex-1 flex-col items-center gap-12 pb-12">
        <div className="text-xl">우나 익스프레스 1호기 발사 캠페인</div>
        <div className="flex gap-12 flex-col md:flex-row">
          <div>
            <div className="text-lg">발사 예정시간</div>
            <div className="text-5xl">12:00:00</div>
          </div>
          <div>
            <div className="text-lg">발사까지 남은시간</div>
            <div className="text-5xl">
              <Timer startTime={new Date("2024-11-11T12:00:00")} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 italic">
          {allProcesses.map((process, index) => (
            <div
              key={process}
              className={clsx("text-lg", {
                "opacity-50": index !== currentProcess,
              })}
            >
              {index + 1}. {process}
            </div>
          ))}
        </div>
      </div>
      <div className="flex">
        <div className="bg-gray-900 w-32 h-16">로고 들어갈 자리</div>
        <div className="flex-1 flex justify-center items-center text-xl">
          UNA EXPRESS - I
        </div>
      </div>
    </div>
  );
}
