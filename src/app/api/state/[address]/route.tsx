import { NextResponse } from "next/server"
import {
  http,
  parseAbiParameters,
  encodeAbiParameters,
  publicActions,
  keccak256,
  toHex,
  parseAbi,
  walletActions,
  createTestClient,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { hardhat } from "viem/chains"

type Params = {
  address: string
}

const account = privateKeyToAccount(process.env.DEPLOYER_PK as any)
const client = createTestClient({
  mode: "anvil",
  account,
  chain: hardhat,
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions)

const DAPP_ADDRESS = "0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C"
const SC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const INPUT_ADDRESS = "0x59b22D57D4f067708AB0c00552767405926dc768"
export async function POST(request: Request, context: { params: Params }) {
  await client.setBalance({
    address: account.address,
    value: BigInt(0.2e18),
  })

  const { request: result } = await client.simulateContract({
    address: INPUT_ADDRESS,
    abi: parseAbi(["function addInput(address, bytes)"]),
    functionName: "addInput",
    gas: 2e6 as any,
    args: [
      DAPP_ADDRESS,
      encodeAbiParameters(parseAbiParameters("address, bytes32, uint256"), [
        context.params.address as any,
        keccak256(toHex("ssb")),
        BigInt(30),
      ]),
    ],
  })

  const hash = await client.writeContract(result)

  // TODO: Connect with Cartesi State
  return NextResponse.json(
    { address: context.params.address, hash },
    { status: 200 }
  )
}

export async function GET(request: Request, context: { params: Params }) {
  const value = await client.readContract({
    address: SC_ADDRESS,
    abi: parseAbi([
      "function getPlayedTime(address,bytes32) external view returns (uint256)",
    ]),
    account: account.address,
    functionName: "getPlayedTime",
    args: [context.params.address as any, keccak256(toHex("ssb"))],
  })

  // TODO: Connect with Cartesi State
  return NextResponse.json({ value }, { status: 200 })
}
