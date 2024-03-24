"use client"

import Canvas from "@/components/Canvas"
import { useRoms } from "@/lib/utils/emu"
import { useParams } from "next/navigation"
import { useEffect } from "react"

let timer: NodeJS.Timeout
export default function TestPage() {
  const { id } = useParams() as { id: string }
  const { play } = useRoms()

  useEffect(() => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      console.debug({ id })
      if (id) play({ id })
    }, 500)
  }, [id])

  return (
    <div className="w-full min-h-screen relative">
      <Canvas className="absolute top-0 w-full left-0 h-full" />
    </div>
  )
}
