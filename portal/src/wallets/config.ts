import { http, createConfig, createStorage } from "wagmi";
import {
  base,
  mainnet,
  arbitrum,
  arbitrumSepolia,
  arbitrumNova,
  polygon,
  polygonAmoy,
} from "wagmi/chains";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [mainnet, base, arbitrumSepolia, arbitrum, arbitrumNova, polygon, polygonAmoy],
  connectors: [injected()],
  batch: { multicall: true },

  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [arbitrumNova.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});
