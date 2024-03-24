"use client";
import Image from "next/image";
export default function Frens() {
  return (
    <div className="flex items-center p-16 justify-center flex-col ">
      <div className="animate-pulse flex items-center justify-center ">
        <Image src="/asset_star.svg" alt="" width={50} height={50} />
        <h2 className="text-2xl py-8">Friends</h2>
        <Image src="/asset_star.svg" alt="" width={50} height={50} />
      </div>
      <div className="bg-lime-500 text-black items-center gap-8 p-32 flex flex-row">
		<button className="flex flex-row items-center justify-center rounded-xl border-2 p-2">
			<Image src="/asset_plus.svg" alt="" width={50} height={50} />
			Add new friend
		</button>

        <div className="flex flex-col">
          <h2 className="text-red-500 text-2xl py-4 text-center">Rank</h2>
		   
          <div className="flex items-center flex-row ">
		  <p className="text-red-500 text-center px-2">{'#'}232</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_oro.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>Joel.eth</strong>
          </div>
          <div className="flex items-center flex-row">
		  <p className="text-red-500 text-center px-2">{'#'}429</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_plata.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>Marcus.eth</strong>
          </div>
          <div className="flex items-center flex-row">
		  <p className="text-red-500 text-center px-2">{'#'}613</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_bronce.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>Charles.eth</strong>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-red-500 text-2xl py-4 text-center">Game</h2>
          
          <strong className="py-3">Zelda</strong>
          <strong className="py-3">Mario Kart</strong>
          <strong className="py-3">Yoshi Island</strong>
        </div>
        <div className="flex flex-col">
          <h2 className="text-red-500 text-2xl py-4 text-center">Time</h2>
          <strong className="py-3">0h 3m 23s</strong>
          <strong className="py-3">0h 2m 12s</strong>
          <strong className="py-3">0h 1m 32s</strong>
        </div>
      </div>
    </div>
  );
}
