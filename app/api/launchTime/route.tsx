import { utcToKst } from "@/app/utils/time";
import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<{ time: Date }>> {
  const docRef = doc(db, "launch", "1");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const utcDate = docSnap.data().time.toDate();
    const kstDate = utcToKst(utcDate);
    return NextResponse.json({ time: kstDate });
  }
  return NextResponse.json({ time: new Date() });
}

export async function POST(request: Request) {
  const { time } = await request.json();
  const docRef = doc(db, "launch", "1");
  await setDoc(docRef, { time: new Date(time) });
  return NextResponse.json({ time });
}
