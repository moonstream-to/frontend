import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";

const SQLEdit = dynamic(() => import("../SQLEdit"), { ssr: false });

const AnalyticsQueryContent = ({ content }: { content: string }) => {
  return (
    <Accordion allowMultiple>
      <AccordionItem border="none">
        <AccordionButton p="0">
          <Flex
            justifyContent="end"
            w="100%"
            textAlign="right"
            fontWeight="700"
            fontSize="14px"
            pr="10px"
          >
            Query
          </Flex>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel p="0">
          <SQLEdit sql={content} marginTop="20px" />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AnalyticsQueryContent;
