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
    <Flex
      justifyContent="space-between"
      fontFamily="JetBrains Mono, monospace"
      w="100%"
      gap={{ base: "10px", sm: "50px" }}
    >
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
    <Accordion allowToggle w="100%" p="0" fontFamily="JetBrains Mono, monospace">
      <AccordionItem border="none">
        <h2>
          <AccordionButton _expanded={{ bg: "none" }} p="0">
            <Box
              flex="1"
              textAlign="left"
              fontSize={{ base: "12px", sm: "18px" }}
              textTransform="capitalize"
              pr={{ base: "10px", sm: "50px" }}
            >
              {service.name}
            </Box>
            <Text
              fontSize={{ base: "12px", sm: "18px" }}
              color={service.isHealthy ? healthyStatusColor : downStatusColor}
            >
              {service.isHealthy ? healthyStatusText : downStatusText}
            </Text>
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
              <Text mr="10px">{d.key}</Text>
              <Text>{d.value}</Text>
            </Box>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default StatusRow;
