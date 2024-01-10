import { AccordionButton, AccordionPanel, Heading, Box, AccordionItem } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";

const FAQCard = ({
  heading,
  headingProps,
  panelContent,
}: {
  heading: string;
  headingProps?: any;
  panelContent: ReactNode;
}) => {
  const iconColor = "#F56646";

  return (
    <AccordionItem borderWidth={0} borderBottomWidth="0!important" px={0}>
      {({ isExpanded }) => (
        <>
          <AccordionButton px={0}>
            <Box flex="1" textAlign="left">
              <Heading as="h3" fontSize={["md", "md", "lg", "lg", null]}>
                {heading}
              </Heading>
            </Box>
            {isExpanded ? (
              <MinusIcon color={iconColor} fontSize="12px" />
            ) : (
              <AddIcon color={iconColor} fontSize="12px" />
            )}
          </AccordionButton>
          <AccordionPanel
            px={0}
            pb={4}
            fontSize={["sm", "sm", "md", "md", null]}
            fontFamily={'"Inter", sans-serif'}
          >
            {panelContent}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};

export default FAQCard;
