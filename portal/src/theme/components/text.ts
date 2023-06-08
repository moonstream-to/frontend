function variantMenuButton() {
  const c = "orange";
  return {
    _focus: {
      textDecoration: "underline",
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
  };
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

const variantOrangeGradient = () => {
  return {
    border: "none",
    borderRadius: "30px",
    fontSize: ["md", "md", "lg", "lg", "xl", "xl"],
    textColor: "white",
    bg: "linear-gradient(92.26deg, #F56646 8.41%, #FFFFFF 255.37%)",
    fontWeight: "700",
    padding: "5px 30px",
    maxHeight: "36px",
    _hover: {
      bg: "linear-gradient(264.06deg, #F56646 -6.89%, #FFFFFF 335.28%)",
    },
  };
};

const variantWyrmButton = () => {
  return {
    minW: ["100%", "100%", "0"],
    px: ["0", "0", "80px"],
    fontSize: ["16px", "20px", "20px"],
    h: ["40px", "46px", "46px"],
    borderRadius: "30px",
  };
};

const variantSelector = () => {
  return {
    p: "0px",
    lineHeight: "1",
    fontSize: "24px",
    fontWeight: "700",
    h: "24px",
    color: "#4d4d4d",
    _disabled: {
      color: "white",
      cursor: "default",
      opacity: "1",
    },
  };
};

const variantPlainOrange = () => {
  return {
    alignItems: "center",
    justifyContent: "center",
    border: "solid transparent",
    borderRadius: "30px",
    // variant: "solid",
    fontSize: ["md", "md", "lg", "lg", "xl", "xl"],
    textColor: "white",
    bg: "#F56646",
    fontWeight: "700",
    padding: "10px 30px",
    _hover: {
      backgroundColor: "#F4532F",
      textDecoration: "none",
    },
    _focus: {
      backgroundColor: "#F4532F",
    },
    _active: {
      backgroundColor: "#F4532F",
    },
  };
};

const variantTransparent = () => {
  return {
    backgroundColor: "transparent",
    _hover: {
      backgroundColor: "transparent",
      textDecoration: "none",
    },
    _focus: {
      backgroundColor: "transparent",
    },
    _active: {
      backgroundColor: "transparent",
    },
  };
};

const variantCancel = () => {
  return {
    padding: "10px 40px",
    backgroundColor: "#4D4D4D",
    _hover: {
      backgroundColor: "#4D4D4D",
      textDecoration: "none",
    },
    _focus: {
      backgroundColor: "#4D4D4D",
    },
    _active: {
      backgroundColor: "#4D4D4D",
    },
  };
};

const variantTitle = () => {
  return {
    padding: "0px",
    fontWeight: "700",
    fontSize: "24px",
    lineHeight: "100%",
    userSelect: "none",
  };
};

const Text = {
  variants: {
    title: variantTitle,
  },
};
export default Text;
