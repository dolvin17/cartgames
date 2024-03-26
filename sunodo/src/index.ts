import {
  encodeFunctionData,
  parseAbiParameters,
  decodeAbiParameters,
  parseAbi,
} from "viem"
import createClient from "openapi-fetch"
import { components, paths } from "./schema"

type AdvanceRequestData = components["schemas"]["Advance"]
type InspectRequestData = components["schemas"]["Inspect"]
type RequestHandlerResult = components["schemas"]["Finish"]["status"]
type RollupsRequest = components["schemas"]["RollupRequest"]
type InspectRequestHandler = (data: InspectRequestData) => Promise<void>
type AdvanceRequestHandler = (
  data: AdvanceRequestData
) => Promise<RequestHandlerResult>

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL
const { POST } = createClient<paths>({ baseUrl: rollupServer })

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const handleAdvance: AdvanceRequestHandler = async (data) => {
  console.log("Received advance request data " + JSON.stringify(data))
  const response = await POST("/voucher", {
    body: {
      destination: CONTRACT_ADDRESS,
      payload: encodeFunctionData({
        abi: parseAbi(["function addRecord(address, bytes32, uint256)"]),
        functionName: "addRecord",
        args: decodeAbiParameters(
          parseAbiParameters("address, bytes32, uint256"),
          data.payload
        ),
      }),
    },
  })

  return response.response.status === 200 ? "accept" : "reject"
}

const handleInspect: InspectRequestHandler = async (data) => {
  console.log("Received inspect request data " + JSON.stringify(data))
}

const main = async () => {
  let status: RequestHandlerResult = "accept"
  let isFirstRequest = true

  while (true) {
    const { response } = await POST("/finish", {
      body: { status },
      parseAs: "text",
    })

    if (response.status === 200) {
      if (isFirstRequest) {
        console.log("Connected. HTTP rollup_server_url is " + rollupServer)
        isFirstRequest = false
      }

      const data = (await response.json()) as RollupsRequest
      switch (data.request_type) {
        case "advance_state":
          status = await handleAdvance(data.data as AdvanceRequestData)
          break
        case "inspect_state":
          await handleInspect(data.data as InspectRequestData)
          break
      }
    } else if (response.status === 202) {
      console.log(await response.text())
    }
  }
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
})
