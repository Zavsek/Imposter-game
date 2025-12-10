import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-screen h-screen flex flex-row items-center justify-center  bg-[linear-gradient(110deg,#fa3d2f,55%,#ff948c)] m-auto'>{children}</div>
  )
}

export default AuthLayout