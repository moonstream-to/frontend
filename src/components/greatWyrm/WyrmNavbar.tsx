import { Text } from "@chakra-ui/react"

const WyrmNavbar = ({ ...props }: { [x: string]: any }) => {
  return (
    <Text
      py={{ base: "12px", md: "15px" }}
      pl={{ base: "22px", sm: "54px", md: "72px", l: "101px" }}
      fontWeight="700"
      fontSize={["24px", "24px", "30px"]}
      lineHeight="120%"
      {...props}
      borderBottom="1px solid white"
    >
      great wyrm
    </Text>
  )
}

export default WyrmNavbar
