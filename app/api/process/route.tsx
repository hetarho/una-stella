import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  const fetchCurrentProcess = async () => {
    const docRef = doc(db, "process", "1");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().current;
    }
    return 0;
  };
  return NextResponse.json({ current: await fetchCurrentProcess() });
}

export async function POST(request: Request) {
  const { current } = await request.json();
  const docRef = doc(db, "process", "1");
  await setDoc(docRef, { current });
  return NextResponse.json({ current });
}
