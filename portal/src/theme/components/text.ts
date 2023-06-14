const variantTitle = () => {
  return {
    padding: "0px",
    fontWeight: "700",
    fontSize: "24px",
    lineHeight: "100%",
    userSelect: "none",
  };
};

const variantTitle2 = () => {
  return {
    padding: "0px",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "100%",
    userSelect: "none",
  };
};

const variantTitle3 = () => {
  return {
    padding: "0px",
    fontWeight: "700",
    fontSize: "16px",
    lineHeight: "100%",
    userSelect: "none",
  };
};

const variantLabel = {
  fontSize: "16px",
  fontWeight: "400",
  lineHight: "20px",
  userSelect: "none",
};
const variantHint = () => {
  return {
    fontSize: "16px",
    fontWeight: "400",
    lineHight: "20px",
    color: "#E6E6E6",
  };
};

const variantText = () => {
  return {
    fontSize: "14px",
    fontWeight: "400",
    lineHight: "18px",
    color: "#FFFFFF",
  };
};

const Text = {
  variants: {
    title: variantTitle,
    title2: variantTitle2,
    title3: variantTitle3,
    hint: variantHint,
    text: variantText,
    label: variantLabel,
  },
};
export default Text;
