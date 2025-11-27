import React from "react";
import { useIgralecStore } from "../../store/useIgralecstore";
import { Globe, Info } from "lucide-react";
import FedoraSvg from "../../assets/svgFedora";
import Navbar from "../Navbar";
import { useIgraStore } from "../../store/useIgraStore";

const HomePage = () => {
 const{createGame} = useIgraStore();
  return (

    <div className="w-screen h-screen bg-black flex justify-center items-center m-auto">
      <div className="h-[70%] w-[80%] rounded-sm bg-gray_light  mt-20 border-4 border-red_lght">
        <div className="w-full h-full grid grid-flow-col grid-rows-2 grid-cols-5">
          <div className=" row-span-2  col-span-2 border-red_lght border-t-2 border-r-2 ">
            <h1 className="text-4xl w-[90%] text-red_lght rounded-sm bg-gray_drk flex m-auto p-3  mt-5 font-primary text-shadow-lg">
              <Info className="pb-3 size-12 pr-2 shadow-2xs" /> KAKO IGRATI
              {"  "}
              <FedoraSvg className="size-10 pl-5 mb-5 w-1/2  absolute right" />
            </h1>
            <div className="text-white "></div>
            <p className="mx-5 mt-5 text-white/80 text-md font-primary text-shadow-lg">
              Igra Imposter je zabavna družabna igra za več igralcev, kjer je
              cilj ugotoviti, kdo med sodelujočimi skriva, da ne pozna skrivne
              besede. Na začetku igre vsak igralec dobi besedo, razen eden
              igralec – temu se dodeli vloga »imposterja«.
            </p>
            <p className="mx-5 mt-2 text-white/80 text-md font-primary text-shadow-lg">
              Ko imajo igralci svoje vloge, se začne krog, v katerem morajo vsi
              po vrsti povedati eno besedo ali kratek namig, ki se navezuje na
              skrivno besedo. Izziv za tiste, ki poznajo besedo, je, da dajo
              dovolj jasen namig, da si med seboj pomagajo, hkrati pa ne preveč
              očiten, da imposter ne bi uganil skrivne besede. Imposter pa se
              poskuša vživeti v igro tako, da pove namig, ki deluje prepričljivo
              in ga ne izdaja.
            </p>
            <p className="mx-5 mt-2 text-white/80 text-md font-primary text-shadow-lg">
              po koncu namigov, sledi glasovanje. Vsak Igralci izžreba igralca,
              kdo se jim zdi sumljiv. Če skupina pravilno razkrije impostorja,
              zmagajo. Če pa imposter preživi glasovanje, ima možnost uganiti
              skrivno besedo. Če mu uspe, zmaga on, sicer zmaga ekipa.
            </p>
          </div>
          <div className="row-span-1 col-span-3 border-t-2 w-full border-red_lght">
            <div className="w-full h-full flex flex-col">


              {/* Naslov in opis */}
              <div className="flex-1 px-5 pt-5">
                <h1 className="font-primary flex bg-gray_drk pt-3 rounded-sm pl-3 pb-5 text-red_lght shadow-2xs text-4xl mb-3">
                  ONLINE
                  <Globe className="size-10  absolute right-55" />
                </h1>
                <p className="font-primary text-white/80 text-md">
                  Ustvari online sobo za igro s prijatelji preko spleta
                </p>
                <p className="font-primary text-white/80 text-md pt-1">
                  Generirala se bo koda za pridružitev drugih igralcev
                </p>
              </div>

              {/* Gumb spodaj */}
              <div className="w-full flex justify-end items-end p-4">
                <button className="group relative cursor-pointer inline-flex h-20 w-50 px-6 items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-red_lght font-medium text-white/80 transition-all duration-100 [box-shadow:5px_5px_rgb(237_12_12)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(237_12_12)]"
                onClick={()=> createGame()}>
                  Ustvari igro
                </button>
              </div>
            </div>
          </div>


          {/*Lokalna igra */}
          <div className="row-span-1 col-span-3 border-t-2 border-red_lght"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
