export default function AdminPage() {
  return (
    <div>
      <div>콘솔창</div>
      <div>
        <div>
          <div>발사 예정 시간</div>
          <input />
        </div>
        <div>
          <div>발사까지 남은시간</div>
          <input />
        </div>
      </div>
      <div className="flex gap-2 items-center text-xl">
        전체 프로세스
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M19.05 5.06c0-1.68-1.37-3.06-3.06-3.06s-3.07 1.38-3.06 3.06v7.87H5.06C3.38 12.93 2 14.3 2 15.99c0 1.68 1.38 3.06 3.06 3.06h7.87v7.86c0 1.68 1.37 3.06 3.06 3.06c1.68 0 3.06-1.37 3.06-3.06v-7.86h7.86c1.68 0 3.06-1.37 3.06-3.06c0-1.68-1.37-3.06-3.06-3.06h-7.86V5.06Z"
          ></path>
        </svg>
      </div>
      <div></div>
    </div>
  );
}
