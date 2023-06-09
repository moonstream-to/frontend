import { Flex, Image, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import { AWS_ASSETS_PATH_CF } from "../../constants";
import styles from "./AddressesPlaceholder.module.css";

const chainLogos = [
  `${AWS_ASSETS_PATH_CF}/icons/eth-outline.png`,
  `${AWS_ASSETS_PATH_CF}/icons/polygon-outline.png`,
  `${AWS_ASSETS_PATH_CF}/icons/polygon-outline.png`,
  `${AWS_ASSETS_PATH_CF}/icons/xdai-outline.png`,
  `${AWS_ASSETS_PATH_CF}/icons/wyrm-small-fill.png`,
];

const chainNames = ["etherium", "polygon", "mumbai", "xdai", "wyrm"];

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
        <Flex gap="15px">
          <Image src={`${AWS_ASSETS_PATH_CF}/icons/sparkles.png`} h="20px" alt="" />
          <Text variant="text" color="#1A1D22">
            Set Moonstream up to watch an account on one of supported blockchains
          </Text>
        </Flex>
        <Flex gap="8px" alignItems="center">
          {chainLogos.map((l, idx: number) => (
            <Fragment key={idx}>
              <Image alt="" src={l} h="20px" />
              <Text fontSize="9px" lineHeight="11px" ml="-5px" textTransform="uppercase">
                {chainNames[idx]}
              </Text>
            </Fragment>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AddressesPlaceholder;
