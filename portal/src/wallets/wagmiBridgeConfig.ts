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

export const wagmiBridgeConfig = createConfig({
  chains: [arbitrumSepolia],
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

const CONTRACT_ADDRESSES = {
  [arbitrumSepolia.id]: {
    UpgradeExecutor: "0xe09FeE5f28325b77979302B72CAdEd23b01dBFcA",
    ArbitrumL1OrbitGatewayRouter: "0x7ee1F4DA6f092bbB778665930F604fFa0E8505A9",
    L1CustomGateway: "0x2B58bBDcC80c1D7A6a81d88889f573377F19f9c3",
    Game7Token: "0x5f88d811246222F6CB54266C42cc1310510b9feA",
  },
};
