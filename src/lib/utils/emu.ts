import { useEffect } from "react"
import { N64 } from "@/lib/n64"

export const ROMS = [
  {
    url: "/roms/F-ZERO X.n64",
    title: "F-ZERO X",
    id: "fzerox",
  },
  {
    url: "/roms/GOLDENEYE.z64",
    title: "GoldenEye 007",
    id: "goldeneye",
  },
  {
    url: "/roms/Mario Kart 64.n64",
    title: "Mario Kart 64",
    id: "mariokart",
  },
  {
    url: "/roms/MortalKombatTrilogy.z64",
    title: "Mortal Kombat Trilogy",
    id: "mk3",
  },
  {
    url: "/roms/SMASH BROTHERS.n64",
    title: "Super Smash Bros.",
    id: "ssb",
  },
  {
    url: "/roms/SUPER MARIO 64.n64",
    title: "Super Mario 64",
    id: "mario64",
  },
  {
    url: "/roms/THE LEGEND OF ZELDA.n64",
    title: "The Legend of Zelda: Ocarina of Time",
    id: "tloz-oot",
  },
  {
    url: "/roms/YOSHI STORY.z64",
    title: "Yoshi’s Story",
    id: "yoshi",
  },
]

export const useRoms = () => {
  const { getInstance } = useEmulator()

  const FORMATTED_ROMS = ROMS.map((rom) => {
    const getGameByes = async () => {
      const response = await fetch(rom.url)
      const content = await response.arrayBuffer()
      return content ? new Uint8Array(content) : undefined
    }

    return { ...rom, getGameByes, romName: rom.url.split("/").pop() }
  })

  return {
    roms: FORMATTED_ROMS,
    getInstance,
    play: async (rom: { id: string }) => {
      const game = FORMATTED_ROMS.find((r) => r.id === rom.id)
      if (!game) return

      const bytes = await game.getGameByes()
      if (bytes) {
        const instance = getInstance()
        instance.reset()
        instance.setRomName(game.romName)
        instance.LoadEmulator(bytes)
      }
    },
  }
}

export const useEmulator = () => {
  const getInstance = (): N64 =>
    typeof window === "undefined" ? {} : (window as any)["myApp"] ?? {}

  useEffect(() => {
    if (getInstance().canvasSize) return
    // Early exit if already initialized

    const instance = new N64()
    ;(window as any)["myApp"] = instance // To reference from EM_ASM

    instance.setupInputController()
  }, [])

  return {
    getInstance,
  }
}
