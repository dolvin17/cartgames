"use client"

import Canvas from "@/components/Canvas"
import { useEffect, useState } from "react"
import { useEmulator, useRoms } from "@/lib/utils/emu"
import Image from "next/image"

let timer: NodeJS.Timeout
export default function PlayPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const [isLoading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const { initialized, play, getCover } = useRoms()

  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      setLoading(false)
    }, 900)
  }, [initialized])

  function handlePlayGame() {
    if (isLoading || !initialized || isPlaying) return

    setLoading(true)
    play({ id }).then(() => {
      setTimeout(() => {
        setIsPlaying(true)
      }, 2900)
    })
  }

  return (
    <div className="relative cursor-pointer w-screen h-screen">
      {isPlaying ? (
        <div className="absolute bg-black/5 py-4 px-5 rounded-3xl mt-2 ml-2 hover:bg-black/90 top-0 left-0 z-20 opacity-15 hover:opacity-25">
          <strong className="text-white text-sm">CONTROLS</strong>
          <ul className="text-white text-xs mt-2">
            <li>A,S</li>
            <li>Z,X,C</li>
            <li>I,J,K,L</li>
            <li>Arrow Keys</li>
          </ul>
        </div>
      ) : (
        <div
          onClick={handlePlayGame}
          className="bg-black/50 backdrop-blur-sm absolute inset-0 z-20 grid place-items-center"
        >
          <strong className="text-white">
            {isLoading ? "Loading..." : "Click to Play"}
          </strong>
        </div>
      )}

      <Canvas
        className={`absolute top-0 w-full left-0 h-full z-10 ${
          isPlaying || "opacity-0"
        }`}
      />
      <Image fill className="object-cover" alt="" src={getCover(id)} />
    </div>
  )
}
