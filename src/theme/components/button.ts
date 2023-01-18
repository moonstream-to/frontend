function variantMenuButton() {
  const c = 'orange'
  return {
    _focus: {
      textDecoration: 'underline',
    },
    _disabled: {
      bg: `${c}.200`,
    },
    _hover: {
      bg: `${c}.500`,
      // color: `${c}.100`,
      _disabled: {
        bg: `${c}.100`,
      },
    },
  }
  // _hover={{
  //   backgroundColor: 'transparent',
  //   color: '#F56646',
  //   fontWeight: '700',
  // }}
  // _focus={{
  //   backgroundColor: 'transparent',
  //   color: '#F56646',
  //   fontWeight: '700',
  // }}
}

const Button = {
  // 1. We can update the base styles
  baseStyle: () => ({
    px: '1rem',
    py: '1rem',
    transition: '0.1s',
    width: 'fit-content',
    borderRadius: 'md',
    borderStyle: 'solid',
    fontWeight: '600',
    m: 1,

    // _active: {
    //   bg: `${props.colorScheme}.${props.colorMode}.200`,
    //   color: `${props.colorScheme}.${props.colorMode}.50`,
    // },
    // _focus: {
    //   bg: `${props.colorScheme}.${props.colorMode}.400`,
    //   color: `${props.colorScheme}.${props.colorMode}.50`,
    // },
  }),
  // 2. We can add a new button size or extend existing
  sizes: {
    xl: {
      h: 16,
      minW: 16,
      fontSize: '4xl',
      px: 8,
    },
  },
  // 3. We can add a new visual variant
  variants: {
    menuButton: variantMenuButton,
  },
}
export default Button
