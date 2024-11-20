export default function TimeBox({
  time,
  showT = false,
  hours,
  minutes,
  seconds,
}: {
  time?: Date;
  showT?: boolean;
  hours?: string;
  minutes?: string;
  seconds?: string;
}) {
  const h = hours ?? time?.getHours().toString().padStart(2, "0") ?? "00";
  const m = minutes ?? time?.getMinutes().toString().padStart(2, "0") ?? "00";
  const s = seconds ?? time?.getSeconds().toString().padStart(2, "0") ?? "00";

  return (
    <div className="flex rounded-xl px-[34px] py-[36px] shadow-[0px_0px_47px_17px_#1A2F10D1] bg-gradient-to-r from-[#010101] via-[#2A471C] to-[#070F04]">
      {showT && <div className="text-[70px] font-semibold mr-[36px]">T -</div>}
      <div className="flex flex-col">
        <div className="flex w-full justify-between items-center gap-[34px]">
          <div className="text-[56px] w-32 font-bold text-center">{h}</div>
          <div className="w-[1px] h-[25px] bg-[#ABABAB]"></div>
          <div className="text-[56px] w-32 font-bold text-center">{m}</div>
          <div className="w-[1px] h-[25px] bg-[#ABABAB]"></div>
          <div className="text-[56px] w-32 font-bold text-center">{s}</div>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="text-[#ABABAB] w-32 mt-2 text-[16px] font-medium text-center">
            Hours
          </div>
          <div className="w-1 h-1"></div>
          <div className="text-[#ABABAB] w-32 mt-2 text-[16px] font-medium text-center">
            Minutes
          </div>
          <div className="w-1 h-1"></div>
          <div className="text-[#ABABAB] w-32 mt-2 text-[16px] font-medium text-center">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
