import React from 'react'
import { LoaderCircle} from "lucide-react";
import FedoraSvg from "../assets/svgFedora";

export const LoadingScreen = () => {
  return (
     <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="pt-10">
        <div className="p-[5px] rounded-sm bg-gradient-to-tr from-red_lght to-red_brght transition-all duration-300 hover:scale-100 hover:shadow-2xl">
          <div className="w-md min-h-120 max-h-120  bg-gray_drk flex flex-col justify-center items-center pb-15 shadow-lg/30 transition-all duration-300 hover:scale-101 hover:shadow-2xl hover:rounded-sm">
            {/* KROG*/}
            <div className="h-40 w-40 flex flex-col justify-center items-center rounded-full px-10 shadow-xl border-2 border-gray_light bg-black/80  ">
              <FedoraSvg className="h-20 w-20 text-red_lght" />
              <h1 className="text-red_lght text-xl font-primary font-semibold ">
                IMPOSTER
              </h1>
            </div>

            <LoaderCircle className="size-8 mt-10 text-white/50 animate-spin" />
            <p className="text-sm text-white/50 font-primary mt-3">
              Pripravljanje vsega potrebnega...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
