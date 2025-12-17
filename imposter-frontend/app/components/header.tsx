 'use client'
import React from 'react'
import SVGComponent from './fedora'
import SVGDisguise from "./disguise.jsx"

interface headerProps{
  username:string|null
  logout: ()=>void
}
const Header: React.FC<headerProps> = ({username, logout}) => {
  
  return (
    <div className='absolute top-0 min-w-screen h-20 flex justify-center items-center bg-black font-primary border-b-9 border-[rgba(13,0,80,0.8)]'>
        <h1 className='text-6xl text-[#fa3d2f] px-10 '>IMPOSTER</h1>
       {username !== null && username !== "" && (
  <div className='flex flex-row absolute right-5 m-auto items-center bg-[rgba(26,10,160,0.8)] min-h-10 w-fit px-2 pr-3 rounded-3xl font-sans font-semibold text-xl text-[#fa3d2f]' >
    <div className="min-w-8 max-h-8  rounded-2xl bg-[rgba(13,0,80,1)] mr-2 border-4 border-[rgba(13,0,80,1)] ">
    <SVGDisguise className="max-w-7.5 max-h-7.5 bg-[#fa3d2f] rounded-2xl"  />
    </div>
    {username}
        <button className=' bg-white h-10 w-fit absolute right-50 px-10 rounded-3xl'
        onClick={logout}> Logout</button>
  </div>
)}
    </div>
  )
}

export default Header