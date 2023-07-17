import { Button, VisuallyHidden } from "@chakra-ui/react";

interface SocialButtonProps {
  children: React.ReactNode;
  label: string;
  href: string;
}

const SocialButton = ({ children, label, href }: SocialButtonProps) => {
  return (
    <Button
      bg="transparent"
      rounded={"full"}
      cursor={"pointer"}
      onClick={() => {
        window.open(href);
      }}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        transform: "scale(1.1)",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};

export default SocialButton;
