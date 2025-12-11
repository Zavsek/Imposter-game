import React from 'react'
import SVGComponent from "../../components/fedora"
import Header from '@/components/header'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (

    <div className='w-screen h-screen flex flex-row items-center justify-center bg-[linear-gradient(160deg,#DE0F00,55%,#FF9088)] m-auto relative'>
    <Header />
      <div className="absolute w-full h-full z-10 flex justify-center items-center">
        <SVGComponent className="w-3/4 h-3/4 opacity-80 mt-20" />
      </div>
      <div className="relative z-20 mt-10">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout