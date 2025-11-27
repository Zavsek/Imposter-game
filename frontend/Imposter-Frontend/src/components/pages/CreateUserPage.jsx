import React from "react";
import { useIgralecStore } from "../../store/useIgralecstore";
import { LoadingScreen } from "../loadingScreen";
import FedoraSvg from "../../assets/svgFedora";
import { useState } from "react";

const CreateUserPage = () => {
  const { createUser, creatingUser } = useIgralecStore();
  const [ime, setIme] = useState("");

  if (creatingUser) return <LoadingScreen />;
  return (
    <div className="w-screen h-screen bg-black flex flex-col">
      {/* Naslovnica */}
      <div className="flex flex-col items-center pt-20 ">
        <div className="w-[90%]">
          <div className="w-full p-[2px] rounded-sm bg-gradient-to-tr from-red_lght to-red_brght">
            <div className="w-full flex flex-col items-center justify-center bg-gray_drk rounded-sm">
              <FedoraSvg className="h-15 w-15 text-red_lght" />
              <h1 className="text-red_lght font-primary text-4xl">IMPOSTER</h1>
              <h2 className="text-red_drk font-primary text-2xl font-semibold">
                VPIŠITE SE
              </h2>
            </div>
          </div>
        </div>

        {/* Spodnja dva div-a */}
       {/* Spodnja dva div-a */}
        <div className="flex-1 w-[90%] flex gap-4 mt-4">
          {/* Div 1: Input + gumb */}
          <div className="flex flex-col items-center w-full p-[2px] rounded-sm bg-gradient-to-tr from-red_lght to-red_brght">
            <div className="w-full flex flex-col min-h-[400px] rounded-sm bg-gray_drk text-red_lght">
              {/* H1 na vrhu */}
              <div className="w-full flex flex-col justify-center items-center pt-10">
                <h1 className="text-red_lght text-3xl font-primary">
                  VPIŠI SE V IGRO
                </h1>
                <h2 className="text-red_drk text-xl font-primary font-semibold">
                  VNESI IME ZA PRIJAVO
                </h2>
              </div>

              {/* Input + gumb */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="relative w-96">
                  <input
                    type="text"
                    id="floatingInput"
                    placeholder=" "
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                    className="peer block w-full h-14 px-4 rounded-sm border-2 border-red_lght bg-black text-white focus:outline-none focus:border-red_lght"
                  />
                  <label
                    htmlFor="floatingInput"
                    className="absolute left-4 top-2 text-gray-400 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-red_lght"
                  >
                    Ime
                  </label>
                </div>
                <button
                  onClick={() => createUser({ ime })}
                  className="px-6 py-2 rounded-sm bg-red_lght text-black font-semibold hover:bg-red_brght"
                >
                  Prijava
                </button>
              </div>
            </div>
          </div>

          {/* Div 2: Prijava kot gost */}
          <div className="w-full p-[2px] rounded-sm bg-gradient-to-tr from-red_lght to-red_brght">
            <div className="rounded-sm min-h-[400px] flex-1 bg-gray_drk text-red_lght flex items-center justify-center">
              <button
                onClick={() => createUser()}
                className="px-6 py-2 rounded-sm bg-red_lght text-black font-semibold hover:bg-red_brght"
              >
                Prijava kot gost
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
