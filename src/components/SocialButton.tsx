import { Button, VisuallyHidden } from "@chakra-ui/react"

interface SocialButtonProps {
  children: React.ReactNode
  label: string
  href: string
}

const SocialButton = ({ children, label, href }: SocialButtonProps) => {
  // const { buttonReport } = useContext(AnalyticsContext)
  return (
    <Button
      // bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      bg="transparent"
      rounded={"full"}
      cursor={"pointer"}
      // maxW='30px'
      onClick={() => {
        // buttonReport(label, 'footer', 'landing')
        window.open(href)
      }}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: "black",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  )
}

export default SocialButton
