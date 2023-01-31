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
        type: PAGETYPE.CONTENT,
      },
      {
        title: 'Case studies',
        path: 'https://docs.google.com/document/d/1mjfF8SgRrAZvtCVVxB2qNSUcbbmrH6dTEYSMfHKdEgc',
        type: PAGETYPE.EXTERNAL,
      },
      {
        title: 'Whitepapers',
        path: 'https://moonstream.to/whitepapers',
        type: PAGETYPE.CONTENT,
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

export const MULTICALL2_CONTRACT_ADDRESSES = {
  '137': '0xc8E51042792d7405184DfCa245F2d27B94D013b6',
  '80001': '0x6842E0412AC1c00464dc48961330156a07268d14', 
}

export const MAX_INT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'

