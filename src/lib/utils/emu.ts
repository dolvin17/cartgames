"use client"

import type { StaticImageData } from "next/image"
import { useEffect, useState } from "react"
import { N64 } from "@/lib/n64"

import asset_mk from "@/public/asset_mortal.png"
import asset_sm from "@/public/asset_smash.png"
import asset_zelda from "@/public/asset_zelda.png"
import asset_geye from "@/public/asset_zero.png"
import asset_fzero from "@/public/asset_fzero.png"
import asset_supermario from "@/public/asset_supermario.png"
import asset_kart from "@/public/asset_kart.png"
import asset_jossy from "@/public/asset_jossy.png"

export const ROMS = [
  {
    url: "/roms/MortalKombatTrilogy.z64",
    title: "Mortal Kombat Trilogy",
    id: "mk3",
    cover: asset_mk,
  },
  {
    url: "/roms/THE LEGEND OF ZELDA.n64",
    title: "The Legend of Zelda: Ocarina of Time",
    id: "tloz-oot",
    cover: asset_zelda,
  },
  {
    url: "/roms/GOLDENEYE.z64",
    title: "GoldenEye 007",
    id: "goldeneye",
    cover: asset_geye,
  },
  {
    url: "/roms/Mario Kart 64.n64",
    title: "Mario Kart 64",
    id: "mariokart",
    cover: asset_kart,
  },
  {
    url: "/roms/F-ZERO X.n64",
    title: "F-ZERO X",
    id: "fzerox",
    cover: asset_fzero,
  },
  {
    url: "/roms/SMASH BROTHERS.n64",
    title: "Super Smash Bros.",
    id: "ssb",
    cover: asset_sm,
  },
  {
    url: "/roms/SUPER MARIO 64.n64",
    title: "Super Mario 64",
    id: "mario64",
    cover: asset_supermario,
  },

  {
    url: "/roms/YOSHI STORY.z64",
    title: "Yoshi’s Story",
    id: "yoshi",
    cover: asset_jossy,
  },
]

const FORMATTED_ROMS = ROMS.map((rom) => {
  const getGameByes = async () => {
    const response = await fetch(rom.url)
    return new Uint8Array(await response.arrayBuffer())
  }

  return { ...rom, getGameByes }
})

export const useRoms = () => {
  const { getInstance, initialized } = useEmulator()

  return {
    initialized,
    getInstance,
    roms: FORMATTED_ROMS,
    getCover: (id: string): StaticImageData => {
      return FORMATTED_ROMS.find((r) => r.id === id)?.cover!
    },
    play: async (rom: { id: string }) => {
      const game = FORMATTED_ROMS.find((r) => r.id === rom.id)
      if (!game) return

      const bytes = await game.getGameByes()
      if (bytes) {
        getInstance().play(game.id, bytes)
      }
    },
  }
}

export const useEmulator = () => {
  const [initialized, setInitialized] = useState(false)

  const getInstance = (): N64 =>
    typeof window === "undefined" ? {} : (window as any)["myApp"] ?? {}

  function onInit() {
    console.debug("Initialized")
    if (initialized) return

    setInitialized(true)
  }

  useEffect(() => {
    if (initialized) {
      console.debug("Already initialized")
      return onInit()
    }

    const instance = new N64()
    instance.onInit = onInit
    ;(window as any)["myApp"] = instance // To reference from EM_ASM

    instance.setupInputController()
  })

  return {
    initialized,
    getInstance,
  }
}
