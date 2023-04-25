import React, { useState } from "react";
import { Button, Spinner, Text } from "@chakra-ui/react";
import SignIn from "./SignIn";
import useUser from "../contexts/UserContext";
import useLogout from "../hooks/useLogout";
import SignUp from "./SignUp";

const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

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
      {/* {!user && ( */}
      <Button
        bg="#353535"
        borderRadius="20px"
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
          console.log(user);
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
      {/* )} */}
      <SignIn isOpen={isOpen} onClose={handleClose} onSignUp={() => setIsSignUpOpen(true)} />
      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
    </>
  );
};

export default LoginButton;
