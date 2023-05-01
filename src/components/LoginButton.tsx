import React, { useState } from "react";
import { Button, Spinner } from "@chakra-ui/react";
import SignIn from "./SignIn";
import useUser from "../contexts/UserContext";
import useLogout from "../hooks/useLogout";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);

  const { user } = useUser();

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const { logout, isLoading } = useLogout();
  return (
    <>
      <Button
        bg="#353535"
        borderRadius="20px"
        maxH="36px"
        p="5px 15px"
        fontSize="16px"
        fontWeight="400"
        minW="90px"
        _hover={{
          bg: "#353535",
        }}
        _focus={{
          outline: "none",
        }}
        onClick={() => {
          if (!user) {
            handleOpen();
          } else {
            logout();
          }
        }}
      >
        {isLoading && <Spinner />}
        {!isLoading && user && "Log out"}
        {!isLoading && !user && "Log in"}
      </Button>
      <SignIn
        isOpen={isOpen}
        onClose={handleClose}
        onSignUp={() => setIsSignUpOpen(true)}
        onForgotPassword={() => setIsForgotPassOpen(true)}
      />
      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      <ForgotPassword isOpen={isForgotPassOpen} onClose={() => setIsForgotPassOpen(false)} />
    </>
  );
};

export default LoginButton;
