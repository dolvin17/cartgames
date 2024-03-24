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
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const { initialized, play, getCover } = useRoms()

  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [initialized])

  function handlePlayGame() {
    if (loading || !initialized) return
    play({ id }).then(() => setIsPlaying(true))
  }

  return (
    <div
      onClick={handlePlayGame}
      className="relative cursor-pointer w-screen h-screen"
    >
      {isPlaying || (
        <div className="bg-black/50 backdrop-blur-sm absolute inset-0 z-20 grid place-items-center">
          <strong className="text-white">
            {loading ? "Loading..." : "Click to Play"}
          </strong>
        </div>
      )}

      <Canvas className="absolute top-0 w-full left-0 h-full z-10" />
      <Image fill className="object-cover" alt="" src={getCover(id)} />
    </div>
  )
}
