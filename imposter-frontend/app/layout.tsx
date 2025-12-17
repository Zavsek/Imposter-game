'use client'


import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "@/app/components/header";

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
 const {checkAuthOnAppLoad, isAuthenticated, checkingAuth, username, logout} = useAuthStore();

 useEffect(()=>{
  checkAuthOnAppLoad()
 }, [checkAuthOnAppLoad]

)
 useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      router.push('/auth/login/');
    }
    else{
      router.push("/home")
    }
  }, [isAuthenticated, checkingAuth, router]);

  const handleLogout = ()=>{
    logout();
    router.push("/auth/login/");
  }
  return (

    <html lang="en">
      <body>
        <div className='w-screen h-screen  bg-[linear-gradient(160deg,#DE0F00,55%,#FF9088)] relative'>
          <Header username={username} logout={handleLogout}/>

<Toaster
          toastOptions={{
            className: "",
            style: {
              border: "6px solid rgba(13, 0, 80, 0.8)",
              borderRadius: "5px",
              backgroundColor: "#fff",
              marginTop:"10px",
              padding: "20px", 
              background: "rgba(10,10,10,1)",
              color:"#fa3d2f",
              filter: "drop-shadow(0.5rem 0.5rem 50px rgba(255, 255, 255, 0.5))",
            },
          }}
          />
        {children}
          </div>
      </body>
    </html>
  );
}
