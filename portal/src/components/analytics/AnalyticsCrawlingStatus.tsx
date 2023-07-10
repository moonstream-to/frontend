import { Flex, Text, Icon } from "@chakra-ui/react";
import { AiOutlineCloudServer } from "react-icons/ai";
import useAnalytics from "../../contexts/AnalyticsContext";

const AnalyticsCrawlingStatus = ({ address }: { address: any }) => {
  const { statuses, jobs } = useAnalytics();
  const status = statuses[address.id];

  return (
    <>
      {status && status.loaded === false && !jobs.isLoading && (
        <Flex
          border="1px solid #F8D672"
          borderRadius="10px"
          direction="column"
          w="100%"
          alignItems="start"
          p="15px"
          gap="15px"
        >
          {status.eventsNumber !== status.eventsLoaded &&
            status.methodsNumber !== status.methodsLoaded && (
              <>
                <Flex gap="10px">
                  <Icon as={AiOutlineCloudServer} h="20px" w="20px" />
                  <Text fontWeight="700"> Historical data is loading...</Text>
                </Flex>
                <Text>
                  We are gathering all data related to your contract, watch data will be ready here.
                </Text>
              </>
            )}
          {status.eventsNumber === status.eventsLoaded &&
            status.methodsNumber !== status.methodsLoaded && (
              <>
                <Flex gap="10px">
                  <Icon as={AiOutlineCloudServer} h="20px" w="20px" />
                  <Text fontWeight="700"> Methods are loading...</Text>
                </Flex>
                <Text fontSize="14px">
                  Events are loaded, you can already use events analytics. Loaded{" "}
                  {status.methodsLoaded} methods from {status.methodsNumber}
                </Text>
              </>
            )}
        </Flex>
      )}
    </>
  );
};

export default AnalyticsCrawlingStatus;
