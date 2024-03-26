import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

// hh ignition deploy --network hardhat ignition/modules/CartBitRecords.ts
const CartBitRecords = buildModule("CartBitRecords", (m) => {
  const records = m.contract("CartBitRecords")

  return { records }
})

export default CartBitRecords
