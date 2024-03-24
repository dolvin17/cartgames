"use client";
import Image from "next/image";
export default function Profile() {
  return (
    <div className="flex items-center p-16 justify-center flex-col ">
      <div className="animate-pulse flex items-center justify-center ">
        <h2 className="text-2xl py-8">My Games</h2>
        <Image src="/asset_ship.svg" alt="" width={50} height={50} />
      </div>
      <div className="bg-lime-500 text-black items-center gap-8 p-32 flex flex-row">
	  <div className="flex flex-col rounded-xl p-4 hover-borde">
          <h2 className="text-yellow-900 text-2xl py-4 text-center">Mario Kart</h2>

          <div className="flex items-center flex-row gap-4 ">
            <p className="text-red-600 text-center px-2">Best 1st time</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_reloj.svg"
              alt=""
              width={30}
              height={30}
            />
            <strong className="py-3">0h 7m 23s</strong>
          </div>
          <div className="flex items-center flex-row gap-4 ">
            <p className="text-red-600 text-center px-2">Best 2nd time</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_reloj_p.svg"
              alt=""
              width={30}
              height={30}
            />
           <strong className="py-3">0h 16m 11s</strong>
          </div>
          <div className="flex items-center flex-row gap-4 ">
            <p className="text-red-600 text-center px-2">Best 3th time</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_relog_b.svg"
              alt=""
              width={30}
              height={30}
            />
            <strong className="py-3">0h 23m 03s</strong>
          </div>
        </div>
		<div className="flex flex-col  hover-borde p-4">
          <h2 className="text-yellow-900 text-2xl py-4 text-center">Super Mario</h2>

          <div className="flex items-center flex-row gap-4 ">
            <p className="text-red-600 text-center px-2">Best 1st time</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_reloj.svg"
              alt=""
              width={30}
              height={30}
            />
            <strong className="py-3">0h 23m 23s</strong>
          </div>
          <div className="flex items-center flex-row gap-4 ">
            <p className="text-red-600 text-center px-2">Best 2nd time</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_reloj_p.svg"
              alt=""
              width={30}
              height={30}
            />
           <strong className="py-3">0h 36m 11s</strong>
          </div>
          <div className="flex items-center flex-row gap-4 ">
            <p className="text-red-600 text-center px-2">Best 3th time</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_relog_b.svg"
              alt=""
              width={30}
              height={30}
            />
            <strong className="py-3">0h 53m 03s</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
