"use client"

import Canvas from "@/components/Canvas"
import { Fragment, useEffect, useState } from "react"
import { useEmulator, useRoms } from "@/lib/utils/emu"
import Image from "next/image"
import { useRkAccountModal } from "@/lib/wallet"
import { useAccount } from "wagmi"
import { toastDismiss, toastLoading } from "@/lib/toaster"

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

  return (
    <div className="relative cursor-pointer w-screen h-screen">
      {isPlaying ? (
        <Fragment>
          <div className="absolute bg-black/5 py-4 px-5 rounded-3xl mt-4 ml-4 hover:bg-black/90 top-0 left-0 z-20 opacity-15 hover:opacity-25">
            <strong className="text-white text-sm">CONTROLS</strong>
            <ul className="text-white text-xs mt-2">
              <li>A,S</li>
              <li>Z,X,C</li>
              <li>I,J,K,L</li>
              <li>Arrow Keys</li>
            </ul>
          </div>

          <button
            onClick={handleSaveState}
            className="absolute bg-black/50 py-4 px-5 text-xs rounded-full mb-4 ml-4 hover:bg-black/90 bottom-0 left-0 z-20 opacity-30 border-2 border-white/80 hover:opacity-50"
          >
            SAVE STATE
          </button>
        </Fragment>
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
