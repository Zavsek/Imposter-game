'use client'


import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import "./globals.css";
import { VscLoading } from "react-icons/vsc";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const router = useRouter();
 const {checkAuthOnAppLoad, isAuthenticated, checkingAuth} = useAuthStore();

 useEffect(()=>{
  checkAuthOnAppLoad()
 }, [checkAuthOnAppLoad]

)
  if(checkingAuth && !isAuthenticated) return(
    <div className="w-screen, h-screen flex align-middle justify-between"><VscLoading className="animate-spin w-5 h-5 bg-gray-50"/></div>
  )
  else if(!isAuthenticated){

    router.push('/auth/login/')
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
