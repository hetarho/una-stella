"use client";

import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [launchTime, setLaunchTime] = useState<Date>(new Date());

  useEffect(() => {
    const fetchLaunchTime = async () => {
      const docRef = doc(db, "launch", "1");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const utcDate = docSnap.data().time.toDate();
        const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
        setLaunchTime(kstDate);
      }
    };
    fetchLaunchTime();
  }, []);

  const handleLaunchTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLaunchTime(new Date(e.target.value));
  };

  const handleSaveLaunchTime = async () => {
    const docRef = doc(db, "launch", "1");
    await setDoc(docRef, { time: launchTime });
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
    <div>
      <div>콘솔창</div>
      <div>
        <div className="flex gap-2 items-center flex-col">
          <div>발사 예정 시간</div>
          <input
            className="border-2 border-gray-300 rounded-md p-2 text-black"
            type="datetime-local"
            value={formatDateTimeLocal(launchTime)}
            onChange={handleLaunchTimeChange}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-md w-full"
            onClick={handleSaveLaunchTime}
          >
            저장
          </button>
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
