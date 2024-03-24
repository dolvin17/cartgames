"use client";
import Image from "next/image";
export default function Leader() {
  return (
    <div className="flex items-center p-16 justify-center flex-col ">
      <div className="animate-pulse flex items-center justify-center ">
        <Image src="/asset_cup.svg" alt="" width={50} height={50} />
        <h2 className="text-2xl py-8">Leaderboard</h2>
        <Image src="/asset_cup.svg" alt="" width={50} height={50} />
      </div>
      <div className="bg-lime-500 text-black flex items-center gap-8 p-32">
        <div className="flex flex-col">
          <h2 className="text-red-500 text-2xl py-4 text-center">Player</h2>
		  <div className="flex items-center flex-row rounded border-y-2 bg-cyan-200  animate-pulse">
			<p className="text-red-500 text-center">#42</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_flag.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>0x3c...3447</strong>
          </div>
          <div className="flex items-center flex-row ">
		  <p className="text-red-500 text-center px-2">#1</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_oro.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>0x60...60de</strong>
          </div>
          <div className="flex items-center flex-row">
		  <p className="text-red-500 text-center px-2">#2</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_plata.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>0x71...B128</strong>
          </div>
          <div className="flex items-center flex-row">
		  <p className="text-red-500 text-center px-2">#3</p>
            <Image
              className="animate-wiggle-more animate-infinite animate-delay-500 hover:animate-jump  animate-duration-[2000ms] animate-ease-in"
              src="/asset_bronce.svg"
              alt=""
              width={50}
              height={50}
            />
            <strong>0x02...D715</strong>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-red-500 text-2xl py-4 text-center">Game</h2>
          <strong className="py-3  rounded border-y-2 bg-cyan-200  animate-pulse">Super Mario</strong>
          <strong className="py-3">Mortal Kombat</strong>
          <strong className="py-3">Super Mario</strong>
          <strong className="py-3">Yoshi Island</strong>
        </div>
        <div className="flex flex-col">
          <h2 className="text-red-500 text-2xl py-4 text-center">Time</h2>
          <strong className="py-3  rounded border-y-2 bg-cyan-200 animate-pulse">0h 4m 23s</strong>
          <strong className="py-3">3h 43m 23s</strong>
          <strong className="py-3">2h 32m 12s</strong>
          <strong className="py-3">0h 32m 32s</strong>
        </div>
      </div>
    </div>
  );
}
