import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { AWS_ASSETS_PATH_CF, ChainName, getChainImage } from "../../constants";
import styles from "./AddressesPlaceholder.module.css";

const chainNames: ChainName[] = ["ethereum", "polygon", "mumbai", "gnosis", "wyrm"];

const AddressesPlaceholder = () => {
  return (
    <Flex direction="column" gap="20px">
      <Text variant="hint">Watched addresses will appear here.</Text>
      <Flex
        direction="column"
        bg="#94C2FA"
        p="10px"
        gap="10px"
        border="1px solid white"
        borderRadius="10px"
        color="#1A1D22"
        w="340px"
        className={styles.container}
      >
        <Flex gap="15px" alignItems="center">
          <Image src={`${AWS_ASSETS_PATH_CF}/icons/sparkles.png`} h="20px" alt="" />
          <Text variant="text" color="#1A1D22">
            Configure Moonstream to watch an account on one of our supported blockchains
          </Text>
        </Flex>
        <Flex gap="8px" alignItems="center" wrap="wrap" whiteSpace="nowrap">
          {chainNames.map((n, idx: number) => (
            <Box key={idx} display="inline-flex" alignItems="center" gap="3px">
              <Image alt="" src={getChainImage(n)} h="20px" filter="invert(100%)" />
              <Text fontSize="9px" lineHeight="11px" textTransform="uppercase">
                {n}
              </Text>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AddressesPlaceholder;
