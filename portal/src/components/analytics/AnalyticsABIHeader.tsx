import { Flex, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { AiOutlineCloseCircle, AiOutlineSync } from "react-icons/ai";

interface ABIHeaderInterface {
  ABILoader: { name: string } | undefined;
  ABIfromScan: { isFetching: boolean; refetch: () => void };
  abi: { isFetching: boolean; data: unknown };
  ABIStatus: string;
  isABIfromScan: boolean;
  JSONForEdit: string;
  setJSONForEdit: (arg0: string) => void;
}

const AnalyticsABIHeader = ({
  ABILoader,
  ABIfromScan,
  abi,
  ABIStatus,
  isABIfromScan,
  JSONForEdit,
  setJSONForEdit,
}: ABIHeaderInterface) => {
  return (
    <>
      {ABILoader && ABIfromScan.isFetching && (
        <Flex justifyContent="start" gap="10px">
          <Spinner />
          <Text fontSize="14px">{`We are loading ABI from ${ABILoader.name}. Please wait or paste it below manually.`}</Text>
        </Flex>
      )}
      {abi.isFetching && !abi.data && <Spinner ml="10px" p="0" h="20px" w="17px" />}

      {ABIStatus === "error" && (
        <Flex justifyContent="space-between" fontSize="14px">
          <Flex gap="10px" alignItems="center">
            <AiOutlineCloseCircle color="red" width="14px" height="14px" />
            <Text>
              We couldn’t find the ABI automatically. Try again or paste it below manually.
            </Text>
          </Flex>
          <Flex
            gap="10px"
            alignItems="center"
            onClick={() => ABIfromScan.refetch()}
            cursor="pointer"
          >
            <Text>Try again</Text>
            <AiOutlineSync width="14px" height="14px" />
          </Flex>
        </Flex>
      )}
      {isABIfromScan && JSONForEdit !== "" && (
        <Flex justifyContent="space-between" fontSize="14">
          <Flex gap="10px" alignItems="center">
            <Text>{`Loaded from ${ABILoader?.name}`}</Text>
            <AiOutlineSync
              width="14px"
              height="14px"
              onClick={() => ABIfromScan.refetch()}
              cursor="pointer"
            />
          </Flex>
          <Text cursor="pointer" variant="transparent" onClick={() => setJSONForEdit("")}>
            Clear
          </Text>
        </Flex>
      )}
      {JSONForEdit !== "" && !isABIfromScan && (
        <Flex justifyContent="end" fontSize="14">
          <Text cursor="pointer" variant="transparent" onClick={() => setJSONForEdit("")}>
            Clear
          </Text>
        </Flex>
      )}
    </>
  );
};

export default AnalyticsABIHeader;
