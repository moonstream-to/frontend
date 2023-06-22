import RouterLink from "next/link";

import React, { useState } from "react";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Spinner,
} from "@chakra-ui/react";

import LoginButton from "./LoginButton";
import { BsPerson } from "react-icons/bs";
import useUser from "../contexts/UserContext";
import useLogout from "../hooks/useLogout";
import SignUp from "./SignUp";

const Account = () => {
  const { user } = useUser();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <>
      {!user && (
        <Flex gap="10px">
          <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
          <LoginButton>
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
            >
              Log in
            </Button>
          </LoginButton>
          <Button
            fontSize="16px"
            fontWeight="400"
            p="5px 15px"
            maxH="36px"
            variant="plainOrange"
            onClick={() => setIsSignUpOpen(true)}
          >
            Sign up
          </Button>
        </Flex>
      )}
      {isLoggingOut && <Spinner />}
      {user && !isLoggingOut && (
        <Menu>
          <MenuButton>
            <Flex gap="5px" alignItems="center">
              <BsPerson />
              Account
            </Flex>
          </MenuButton>
          <MenuList borderRadius="10px" border="1px solid white" minW="fit-content" p="20px">
            <MenuItem p="0px" mb="10px">
              Settings
            </MenuItem>

            <MenuItem p="0px" mb="10px">
              <RouterLink href="/tokens">API tokens</RouterLink>
            </MenuItem>
            <Divider mb="10px" />
            <MenuItem p="0px" onClick={() => logout()}>
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
};

export default Account;