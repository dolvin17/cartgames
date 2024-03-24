import { NextResponse } from "next/server"

type Params = {
  address: string
}

export async function POST(request: Request, context: { params: Params }) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // TODO: Connect with Cartesi State
  return NextResponse.json({ address: context.params.address }, { status: 200 })
}
