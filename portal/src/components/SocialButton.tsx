import { Button, VisuallyHidden } from "@chakra-ui/react";

interface SocialButtonProps {
  children: React.ReactNode;
  label: string;
  href: string;
}

const SocialButton = ({ children, label, href }: SocialButtonProps) => {
  return (
    <Button
      minWidth="0"
      minH="0"
      maxH="24px"
      h="fit-content"
      paddingInline="0"
      py="0"
      bg="transparent"
      cursor={"pointer"}
      onClick={() => {
        window.open(href);
      }}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        filter:
          "brightness(0) saturate(100%) invert(61%) sepia(37%) saturate(4099%) hue-rotate(324deg) brightness(133%) contrast(94%)",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};

export default SocialButton;
