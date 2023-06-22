import { Flex, Spacer } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";

import PoolDetailsRow from "../PoolDetailsRow";
import AnalyticsABIView from "./AnalyticsABIView";

const AnalyticsSmartContractDetails = ({
  address,
  chain,
  id,
  isAbi,
}: {
  address: string;
  chain: string;
  id: string;
  isAbi: boolean;
}) => {
  return (
    <Flex flex="1 1 0px" direction="column" gap="10px" p="15px" borderRadius="10px" bg="#232323">
      <Accordion allowMultiple>
        <AccordionItem border="none">
          <AccordionButton p="0">
            <Flex
              justifyContent="space-between"
              w="100%"
              textAlign="right"
              fontWeight="700"
              fontSize="16px"
            >
              Contract details
            </Flex>
            <Spacer />
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p="0">
            <Flex direction="column" mt="20px">
              <PoolDetailsRow
                displayFull={true}
                canBeCopied={true}
                type={"Contract address"}
                value={address}
                fontSize="14px"
              />
              <Flex w="100%" bg="#4D4D4D" h="1px" mt="20px" mb="12px" />
              <AnalyticsABIView address={address} id={id} chain={chain} isAbi={isAbi} />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export default AnalyticsSmartContractDetails;
