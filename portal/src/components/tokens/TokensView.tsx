import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";

import { AiOutlinePlusCircle } from "react-icons/ai";
import useUser from "../../contexts/UserContext";
import styles from "./NewTokenForm.module.css";

import TokensList from "./TokensList";
import NewTokenForm from "./NewTokenForm";

const TokensView = () => {
  const { user } = useUser();

  const {
    isOpen: isNewTokenOpen,
    onClose: onNewTokenClose,
    onOpen: onNewTokenOpen,
  } = useDisclosure();

  if (!user) {
    return <></>;
  }

  return (
    <Flex px="7%" py="30px" w="100%" userSelect="none">
      <Flex
        direction="column"
        p="30px"
        gap="20px"
        borderRadius="20px"
        bg="#2d2d2d"
        minH="100%"
        minW="860px"
        position="relative"
        mx="auto"
      >
        <Flex justifyContent="space-between" w="100%" alignItems="center">
          <Text fontSize="24px" fontWeight="700">
            My API tokens
          </Text>
          <div className={styles.newTokenButton}>
            {isNewTokenOpen && <div className={styles.modalOverlay} onClick={onNewTokenClose} />}
            <NewTokenForm isOpen={isNewTokenOpen} onClose={onNewTokenClose} />
            <button>
              <AiOutlinePlusCircle size="24" onClick={onNewTokenOpen} title="Add token" />
            </button>
          </div>
        </Flex>
        <TokensList />
      </Flex>
    </Flex>
  );
};

export default TokensView;
