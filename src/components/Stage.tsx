"use client";
import Image from "next/image";
import asset_mk from "../../public/asset_mortal.png";
import asset_sm from "../../public/asset_smash.png";
import asset_zelda from "../../public/asset_zero.png";
import asset_fzero from "../../public/asset_fzero.png";
import asset_supermario from "../../public/asset_supermario.png";
import asset_kart from "../../public/asset_kart.png";
import asset_jossy from "../../public/asset_jossy.png";

export default function Stage() {
  return (
    <>
      <div className="top-0 left-0 w-full h-full  z-10">
      <div className="z-20 top-40 left-60 absolute flex flex-row gap-4 overflow-x-auto">
        <div className="  h-400px] w-[400px] hover-borde">
          <Image src={asset_mk} alt="" placeholder="blur" />
        </div>
        <div className="  h-400px] w-[400px]   hover-borde ">
          <Image src={asset_sm} alt="" placeholder="blur" />
        </div>
        <div className="  h-400px] w-[400px]  hover-borde  ">
          <Image src={asset_zelda} alt="" placeholder="blur" />
        </div>
        <div className="  h-400px] w-[400px]  hover-borde  ">
          <Image src={asset_fzero} alt="" placeholder="blur" />
        </div>
        <div className="  h-400px] w-[400px]  hover-borde  ">
          <Image src={asset_supermario} alt="" placeholder="blur" />
        </div>
        <div className="  h-400px] w-[400px]  hover-borde  ">
          <Image src={asset_kart} alt="" placeholder="blur" />
        </div>
        <div className="  h-400px] w-[400px]  hover-borde  ">
          <Image src={asset_jossy} alt="" placeholder="blur" />
        </div>
      </div>
	  </div>
    </>
  );
}
