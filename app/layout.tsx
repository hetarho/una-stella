import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

const montserrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "우나 스텔라",
  description: "우나 익스프레스 1호 발사 캠페인",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}
        <footer
          className="flex h-16 px-8 justify-center items-center"
          style={{
            boxShadow: "0px 0px 106.8px -7px #2F4721",
          }}
        >
          <div>
            <Image src={"/logo.png"} alt="logo" width={74} height={34} />
          </div>
          <div className="flex-1 flex justify-center items-center text-[20px] font-medium">
            UNA EXPRESS-I (R)
          </div>
          <div className="text-[20px] font-semibold">2025</div>
        </footer>
      </body>
    </html>
  );
}
