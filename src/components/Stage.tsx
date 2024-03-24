"use client"

import { ROMS } from "@/lib/utils/emu"
import Image from "next/image"
import Link from "next/link"
import Spline from "@splinetool/react-spline"


export default function Stage() {
  return (
    <>
	<div >
	<Spline scene="https://prod.spline.design/UfNb7uYuCNZyOwFf/scene.splinecode" />
	</div>
      <div className="z-20 [&_div]:shrink-0 pb-52 top-60 left-0 scroll-smooth right-0 absolute flex flex-row gap-4 overflow-x-auto">
        {ROMS.map(({ id, cover }) => (
          <Link
            href={`/load/${id}`}
            target="_blank"
            key={`game-${id}`}
            className="shrink-0 block h-400px] w-[400px] hover-borde"
          >
            <Image src={cover!} alt="" placeholder="blur" />
          </Link>
        ))}
      </div>
    </>
  )
}
