import { inputAnatomy } from "@chakra-ui/anatomy"
import { createMultiStyleConfigHelpers } from "@chakra-ui/react"

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    color: "white",
    border: "1px solid white",
    borderRadius: "10px",
    bg: "transparent",
    fontSize: "18px",
    _focus: { border: "2px solid white" },
    _active: { border: "2px solid white" },
    _focusVisible: { border: "2px solid white" },
    _focusWithin: { border: "2px solid white" },
    _hover: { border: "2px solid white" },
  },
})

const address = definePartsStyle({
  field: {
    fontFamily: "Jet Brains Mono, monospace",
    fontSize: "min(18px, 9px + 0.7vw)",
    w: "42ch",
    px: "1ch",
  },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle, variants: { address } })
