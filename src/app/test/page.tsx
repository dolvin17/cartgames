"use client"

import Canvas from "@/components/Canvas"
import { useEmulator } from "@/lib/utils/emu"

export default function TestPage() {
  const { getInstance } = useEmulator()

  return (
    <div className="w-full min-h-screen relative">
      <input
        type="file"
        className="z-[1] fixed top-0 left-0"
        onInput={async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const rom = await file.arrayBuffer()
            getInstance().play(file.name, new Uint8Array(rom))
          }
        }}
      />
      <Canvas className="absolute top-0 w-full left-0 h-full" />
    </div>
  )
}
