"use client"

import Image from "next/image"
import { Fragment, useEffect, useState } from "react"
import { useRkAccountModal } from "@/lib/wallet"
import Canvas from "@/components/Canvas"

import { useAccount } from "wagmi"
import { toastDismiss, toastLoading } from "@/lib/toaster"
import { SlSizeFullscreen } from "react-icons/sl"

import { useRoms } from "@/lib/utils/emu"
import { get } from "http"

let timer: NodeJS.Timeout
export default function PlayPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { isConnected, address } = useAccount()
  const { openAccountModal } = useRkAccountModal()
  const [isLoading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const { initialized, play, getCover, getInstance } = useRoms()

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

  function handleSaveState() {
    if (!isConnected) return openAccountModal()
    const id = toastLoading("Saving data onchain...")
    fetch(`/api/state/${address}`, {
      method: "POST",
    })
      .catch(() => {})
      .finally(() => {
        toastDismiss(id)
      })

    // TODO: Save state on chain
  }

  function handleFullscreen(e: any) {
    getInstance()?.fullscreen()
  }

  return (
    <main id="gameContainer" className="w-screen h-screen">
      {isPlaying ? (
        <Fragment>
          <div className="absolute p-3 cursor-pointer top-0 right-0 z-20 opacity-15 hover:opacity-35 select-none">
            <strong className="text-white text-sm">CONTROLS</strong>
            <ul className="text-white text-xs mt-2">
              <li>A,S</li>
              <li>Z,X,C</li>
              <li>I,J,K,L</li>
              <li>Arrow Keys</li>
            </ul>
          </div>

          <nav className="absolute flex items-center gap-3 text-xs mb-7 ml-7 bottom-0 left-0 z-30">
            <button
              onClick={handleFullscreen}
              className="bg-black/50 backdrop-blur-md py-4 group px-5 rounded-full border-white/80 hover:opacity-50 hover:bg-black/90 opacity-30 border-2"
            >
              <SlSizeFullscreen className="scale-125 group-hover:scale-[1.3]" />
            </button>

            <button
              onClick={handleSaveState}
              className="bg-black/50 backdrop-blur-md py-4 px-5 rounded-full border-white/80 hover:opacity-50 hover:bg-black/90 opacity-30 border-2"
            >
              SAVE STATE
            </button>
          </nav>
        </Fragment>
      ) : (
        <div
          onClick={handlePlayGame}
          tabIndex={-1}
          className="bg-black/50 cursor-pointer backdrop-blur-sm absolute inset-0 z-20 grid place-items-center"
        >
          <strong className="text-white">
            {isLoading ? "Loading..." : "Click to Play"}
          </strong>
        </div>
      )}

      <Canvas
        className={`absolute pointer-events-none top-0 w-full left-0 h-full z-10 ${
          isPlaying || "opacity-0"
        }`}
      />
      <Image
        fill
        className="object-cover pointer-events-none"
        alt=""
        src={getCover(id)}
      />
    </main>
  )
}
