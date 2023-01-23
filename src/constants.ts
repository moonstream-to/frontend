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
        path: '/features',
        type: PAGETYPE.CONTENT,
      },
      {
        title: 'Case studies',
        path: 'https://docs.google.com/document/d/1mjfF8SgRrAZvtCVVxB2qNSUcbbmrH6dTEYSMfHKdEgc',
        type: PAGETYPE.EXTERNAL,
      },
      {
        title: 'Whitepapers',
        path: '/whitepapers',
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
    path: '/developers',
    type: PAGETYPE.EMPTY,

    children: [
      {
        title: 'Docs',
        path: 'https://docs.moonstream.to/',
        type: PAGETYPE.CONTENT,
      },
      {
        title: 'Status',
        path: '/status',
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
        path: '/team',
        type: PAGETYPE.CONTENT,
      },
    ],
  },
]

export const USER_NAV_PATHES = [
  {
    title: 'Learn how to use Moonstream',
    path: '/welcome',
  },
]
