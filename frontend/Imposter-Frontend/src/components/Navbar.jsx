import React from 'react'
import { useIgralecStore } from '../store/useIgralecstore'
const Navbar = () => {
      const { userInstance } = useIgralecStore();
  return (
    <div className='w-screen flex items-center justify-center min-h-20 absolute'>

    <div className='w-[90%] absolute min-h-20 bg-transparent'>

    <div className=' w-full select-none  flex flex-col items-center  mt-2  fixed top-0 z-40 '>
        <h1 className='text-6xl text-red_lght font-primary text-shadow-[_1.8px_1.2px_rgba(0,0,0,0.8)] cursor-pointer group transition duration-300'>IMPOSTER
            <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-blue-200"></span>
        </h1>
        </div>
        </div>
        {userInstance && (
                <div className='absolute right-40 bg-gray_light min-h-10 min-w-30 flex justify-center items-center shadow-2xl top-5 '>
                <p className='text-red_lght font-primary text-xl'>{userInstance.ime}</p>
                </div>
            )}
    </div>
  )
}

export default Navbar