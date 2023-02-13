export const SITEMAP_CATEGORIES = {
  SOLUTIONS: 'Solutions',
  DEVELOPERS: 'Developers',
  RESOURCES: 'Resources',
  ABOUT: 'About',
}

export const PAGETYPE = {
  EMPTY: 0,
  CONTENT: 1,
  EXTERNAL: 2,
  FOOTER_CATEGORY: 3,
}

export const SITEMAP = [
  {
    title: 'Resources',
    path: '/resources',
    type: PAGETYPE.EMPTY,
    children: [
      {
        title: 'Features',
        path: 'https://moonstream.to/features',
        type: PAGETYPE.EXTERNAL,
      },
      {
        title: 'Case studies',
        path: 'https://docs.google.com/document/d/1mjfF8SgRrAZvtCVVxB2qNSUcbbmrH6dTEYSMfHKdEgc',
        type: PAGETYPE.EXTERNAL,
      },
      {
        title: 'Whitepapers',
        path: 'https://moonstream.to/whitepapers',
        type: PAGETYPE.EXTERNAL,
      },
      {
        title: 'Blog',
        path: 'https://blog.moonstream.to',
        type: PAGETYPE.EXTERNAL,
      },
    ],
  },
  {
    title: 'Developers',
    path: 'https://moonstream.to/developers',
    type: PAGETYPE.EMPTY,

    children: [
      {
        title: 'Docs',
        path: 'https://docs.moonstream.to/',
        type: PAGETYPE.CONTENT,
      },
      {
        title: 'Status',
        path: 'https://moonstream.to/status',
        type: PAGETYPE.CONTENT,
      },
    ],
  },

  {
    title: 'About',
    path: '/about',
    type: PAGETYPE.EMPTY,
    children: [
      {
        title: 'Team',
        path: 'https://moonstream.to/team',
        type: PAGETYPE.CONTENT,
      },
    ],
  },
]

export const USER_NAV_PATHES = [
  {
    title: 'Learn how to use Moonstream',
    path: 'https://moonstream.to/welcome',
  },
]

const MULTICALL2_POLYGON_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MULTICALL2_POLYGON_CONTRACT_ADDRESS
const MULTICALL2_MUMBAI_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MULTICALL2_MUMBAI_CONTRACT_ADDRESS

export const MULTICALL2_CONTRACT_ADDRESSES = {
  '137': MULTICALL2_POLYGON_CONTRACT_ADDRESS,
  '80001': MULTICALL2_MUMBAI_CONTRACT_ADDRESS,
}

export const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

export const AWS_ASSETS_PATH = `https://s3.amazonaws.com/static.simiotics.com/moonstream/assets`
