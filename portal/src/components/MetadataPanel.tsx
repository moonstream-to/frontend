import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Spacer,
  Text,
} from "@chakra-ui/react";
import PoolDetailsRow from "./PoolDetailsRow";

type MetadataPanelProps = {
  metadata: Record<string, any>;
  excludeFields: string[];
};

const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata, excludeFields }) => (
  <Accordion allowMultiple>
    <AccordionItem border="none">
      <AccordionButton p="0" mb="10px">
        <Spacer />
        <Box as="span" flex="1" textAlign="right" pr="10px" fontWeight="700">
          Metadata
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        {Object.keys(metadata)
          .filter((key) => !excludeFields.includes(key))
          .map((key) => (
            <PoolDetailsRow key={key} type={key} value={String(metadata[key])} />
          ))}
        {metadata?.attributes && (
          <>
            <Text fontWeight="700" mt="20px">
              Attributes:
            </Text>

            {metadata.attributes.map((attribute: { trait_type: string; value: string }) => (
              <PoolDetailsRow
                key={attribute.trait_type}
                type={attribute.trait_type}
                value={String(attribute.value)}
                style={{ marginLeft: "20px" }}
              />
            ))}
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export default MetadataPanel;
