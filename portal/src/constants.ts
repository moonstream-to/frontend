export const SITEMAP_CATEGORIES = {
  SOLUTIONS: "Solutions",
  DEVELOPERS: "Developers",
  RESOURCES: "Resources",
  ABOUT: "About",
};

export const PAGETYPE = {
  EMPTY: 0,
  CONTENT: 1,
  EXTERNAL: 2,
  FOOTER_CATEGORY: 3,
};

export const SITEMAP = [
  {
    title: "Resources",
    path: "/resources",
    type: PAGETYPE.EMPTY,
    children: [
      {
        title: "Features",
        path: "/features",
        type: PAGETYPE.CONTENT,
      },
      {
        title: "Case studies",
        path: "https://docs.google.com/document/d/1mjfF8SgRrAZvtCVVxB2qNSUcbbmrH6dTEYSMfHKdEgc",
        type: PAGETYPE.EXTERNAL,
      },
      {
        title: "Whitepapers",
        path: "/whitepapers",
        type: PAGETYPE.CONTENT,
      },
      {
        title: "Blog",
        path: "https://blog.moonstream.to",
        type: PAGETYPE.EXTERNAL,
      },
    ],
  },
  {
    title: "Developers",
    path: "https://moonstream.to/developers",
    type: PAGETYPE.EMPTY,

    children: [
      {
        title: "Docs",
        path: "https://docs.moonstream.to/",
        type: PAGETYPE.CONTENT,
      },
      {
        title: "Status",
        path: "/status",
        type: PAGETYPE.CONTENT,
      },
    ],
  },

  {
    title: "About",
    path: "/about",
    type: PAGETYPE.EMPTY,
    children: [
      {
        title: "Team",
        path: "/team",
        type: PAGETYPE.CONTENT,
      },
    ],
  },
];

export const USER_NAV_PATHES = [
  {
    title: "Learn how to use Moonstream",
    path: "https://moonstream.to/welcome",
  },
];

const MULTICALL2_POLYGON_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MULTICALL2_POLYGON_CONTRACT_ADDRESS;
const MULTICALL2_MUMBAI_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_MULTICALL2_MUMBAI_CONTRACT_ADDRESS;
const MULTICALL2_WYRM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MULTICALL2_WYRM_CONTRACT_ADDRESS;

export const ENTITY_API = process.env.NEXT_PUBLIC_ENTITY_API_URL;
export const WHITELIST_EVENT_COLLECTION_ID = process.env.NEXT_PUBLIC_WHITELIST_EVENT_COLLECTION_ID;

export const MULTICALL2_CONTRACT_ADDRESSES = {
  "137": MULTICALL2_POLYGON_CONTRACT_ADDRESS,
  "80001": MULTICALL2_MUMBAI_CONTRACT_ADDRESS,
  "322": MULTICALL2_WYRM_CONTRACT_ADDRESS,
};

export const MAX_INT =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`; //TODO delete
export const AWS_ASSETS_PATH_CF = "https://static.simiotics.com/moonstream/assets";

export const AWS_STATIC_ASSETS_PATH = "https://static.simiotics.com/moonstream/assets";

export const PORTAL_PATH = "https://moonstream.to/portal";

export const DISCORD_LINK = "https://discord.gg/K56VNUQGvA";

export type ChainName = "ethereum" | "localhost" | "mumbai" | "polygon" | "wyrm" | "gnosis";
export type ChainId = 1 | 1337 | 80001 | 137 | 322 | 100;

// map chain names to image paths
const chainNameToImagePath: Record<string, string> = {
  ethereum: `${AWS_ASSETS_PATH_CF}/icons/eth-outline.png`,
  localhost: `${AWS_ASSETS_PATH_CF}/icons/localhost-outline.png`,
  mumbai: `${AWS_ASSETS_PATH_CF}/icons/polygon-outline.png`,
  polygon: `${AWS_ASSETS_PATH_CF}/icons/polygon-outline.png`,
  wyrm: `${AWS_ASSETS_PATH_CF}/icons/wyrm-small-fill.png`,
  gnosis: `${AWS_ASSETS_PATH_CF}/icons/gnosis.png`,
  xdai: `${AWS_ASSETS_PATH_CF}/icons/gnosis.png`,
};

// map chain IDs to image paths
const chainIdToImagePath: Record<ChainId, string> = {
  1: `${AWS_ASSETS_PATH_CF}/icons/eth-outline.png`,
  1337: `${AWS_ASSETS_PATH_CF}/icons/localhost-outline.png`,
  80001: `${AWS_ASSETS_PATH_CF}/icons/polygon-outline.png`,
  137: `${AWS_ASSETS_PATH_CF}/icons/polygon-outline.png`,
  322: `${AWS_ASSETS_PATH_CF}/icons/wyrm-small-fill.png`,
  100: `${AWS_ASSETS_PATH_CF}/icons/gnosis.png`,
};

export const getChainImage = (identifier: string | number): string | undefined => {
  if (identifier in chainNameToImagePath) {
    return chainNameToImagePath[identifier as ChainName];
  } else if (identifier in chainIdToImagePath) {
    return chainIdToImagePath[identifier as ChainId];
  }
};

export const SHADOWCORN_CONTRACT_ADDRESS = "0xa7D50EE3D7485288107664cf758E877a0D351725";

export const GOFP_CONTRACT_ADDRESS = "0xDD8bf70a1f3A5557CCaB839E46cAB5533955Da65";
