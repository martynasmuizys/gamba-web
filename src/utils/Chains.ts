import { defineChain } from "viem";
import { sepolia } from "viem/chains";

const anvil = /*#__PURE__*/ defineChain({
  id: 3_1337,
  name: 'Anvil',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
})

export {
  sepolia,
  anvil
}
