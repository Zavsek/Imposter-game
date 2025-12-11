'use client'


import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
 useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      router.push('/auth/login/');
    }
  }, [isAuthenticated, checkingAuth, router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster/>
        {children}
      </body>
    </html>
  );
}
