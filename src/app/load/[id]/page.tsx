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
      {isPlaying || (
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
