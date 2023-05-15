import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

interface LoginButtonProps {
  children: React.ReactNode;
}

const LoginButton: React.FC<LoginButtonProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box display="inline" onClick={() => handleOpen()} style={{ cursor: "pointer" }}>
      <SignIn
        isOpen={isOpen}
        onClose={handleClose}
        onSignUp={() => setIsSignUpOpen(true)}
        onForgotPassword={() => setIsForgotPassOpen(true)}
      />
      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      <ForgotPassword isOpen={isForgotPassOpen} onClose={() => setIsForgotPassOpen(false)} />
      {children}
    </Box>
  );
};

export default LoginButton;
