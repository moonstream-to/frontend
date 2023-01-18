// import { mode, whiten } from "@chakra-ui/theme-tools"

const Menu = {
  parts: ['button', 'list', 'item'],
  baseStyle: () => {
    return {
      button: {
        color: 'green',
        _active: { textDecoration: 'none', backgroundColor: '#1A1D22' },
        _focus: { textDecoration: 'none', backgroundColor: '#1A1D22' },
        _hover: {
          textDecoration: 'none',
          backgroundColor: '#1A1D22',
          fontWeight: '700',
        },
      },
      item: {
        backgroundColor: 'transparent',
        fontWeight: '400',
        fontSize: 'md',
        _hover: {
          textColor: 'orange.1000',
          fontWeight: '700',
        },
        _focus: {
          textColor: 'green.100',
        },
      },
      list: {
        bg: 'transparent',
        borderWidth: 0,
      },
    }
  },
}

export default Menu
