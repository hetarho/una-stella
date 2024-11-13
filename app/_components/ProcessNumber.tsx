import clsx from "clsx";

function ProcessNumber({
  number,
  isPassed,
}: {
  number: number;
  isPassed: boolean;
}) {
  return (
    <div
      className={clsx(
        "z-10 text-[30px] w-[51px] h-[51px] flex items-center justify-center font-regular text-white rounded-full",
        {
          "bg-gradient-to-r from-[#2B471D] to-[#69AD47]": isPassed,
          "border-2 border-white bg-black": !isPassed,
        }
      )}
    >
      {number}
    </div>
  );
}

export default ProcessNumber;
