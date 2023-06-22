import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

const StatusRow = ({
  service,
}: {
  service: { name: string; isHealthy: boolean; details: { key: string; value: string }[] };
}) => {
  const healthyStatusText = "Available";
  const downStatusText = "Unavailable";
  const healthyStatusColor = "green.1000";
  const downStatusColor = "red.600";
  const hasDetails = service.details.length > 0;

  const Status = () => (
    <Flex justifyContent="space-between" fontSize="18px" fontWeight="700" w="100%">
      <Text textTransform="capitalize">{service.name}</Text>
      <Text mr="30px" color={service.isHealthy ? healthyStatusColor : downStatusColor}>
        {service.isHealthy ? healthyStatusText : downStatusText}
      </Text>
    </Flex>
  );

  if (!hasDetails) {
    return <Status />;
  }

  return (
    <Accordion allowToggle w="100%" p="0">
      <AccordionItem border="none">
        <h2>
          <AccordionButton _expanded={{ bg: "none" }} p="0">
            <Box
              flex="1"
              textAlign="left"
              fontSize="18px"
              fontWeight="700"
              textTransform="capitalize"
            >
              {service.name}
            </Box>
            <Box
              fontSize="18px"
              fontWeight="700"
              color={service.isHealthy ? healthyStatusColor : downStatusColor}
            >
              {service.isHealthy ? healthyStatusText : downStatusText}
            </Box>
            <AccordionIcon ml="10px" />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} width="100%">
          {service.details.map((d, idx) => (
            <Box
              key={idx}
              w="100%"
              display="flex"
              justifyContent="space-between"
              fontFamily="JetBrains Mono, monospace"
            >
              <Text>{d.key}</Text>
              <Text>{d.value}</Text>
            </Box>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default StatusRow;
