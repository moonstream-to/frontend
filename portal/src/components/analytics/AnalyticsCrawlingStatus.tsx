import { Flex, Text, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlineCloudServer, AiOutlineLoading } from "react-icons/ai";
import { useQuery } from "react-query";
import http from "../../utils/httpMoonstream";
interface Status {
  type: "event" | "function";
  finished: boolean;
}

const AnalyticsCrawlingStatus = ({ address }: { address: any }) => {
  const [eventsNumber, setEventsNumber] = useState(0);
  const [eventsLoaded, setEventsLoaded] = useState(0);
  const [methodsNumber, setMethodsNumber] = useState(0);
  const [methodsLoaded, setMethodsLoaded] = useState(0);
  const [loaded, setLoaded] = useState(true);

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  useEffect(() => {
    setEventsLoaded(0);
    setEventsNumber(0);
    setMethodsLoaded(0);
    setMethodsNumber(0);
    setLoaded(true);
  }, [address]);

  const jobs = useQuery(
    ["jobs", address.id],
    async () => {
      const res = await http({
        method: "GET",
        url: `${API}/subscriptions/${address.id}/jobs`,
      });

      const statuses = res.data.map((job: any) => {
        return {
          type: job.tags.includes("type:event") ? "event" : "function",
          finished:
            job.tags.includes("historical_crawl_status:finished") ||
            !job.tags.some((t: string) => t.includes("historical_crawl_status")),
        };
      });
      setLoaded(!statuses.some((s: Status) => !s.finished));
      setEventsNumber(statuses.filter((s: Status) => s.type === "event").length);
      setEventsLoaded(statuses.filter((s: Status) => s.type === "event" && s.finished).length);
      setMethodsNumber(statuses.filter((s: Status) => s.type === "function").length);
      setMethodsLoaded(statuses.filter((s: Status) => s.type === "function" && s.finished).length);
    },
    {
      enabled: !!address.id && address.type === "smartcontract",
    },
  );

  return (
    <>
      {!loaded && !jobs.isLoading && (
        <Flex
          border="1px solid #F8D672"
          borderRadius="10px"
          direction="column"
          w="100%"
          alignItems="start"
          p="15px"
          gap="15px"
        >
          {eventsNumber !== eventsLoaded && methodsNumber !== methodsLoaded && (
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
          {eventsNumber === eventsLoaded && methodsNumber !== methodsLoaded && (
            <>
              <Flex gap="10px">
                <Icon as={AiOutlineCloudServer} h="20px" w="20px" />
                <Text fontWeight="700"> Methods are loading...</Text>
              </Flex>
              <Text fontSize="14px">
                Events are loaded, you can already use events analytics. Loaded {methodsLoaded}{" "}
                methods from {methodsNumber}
              </Text>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default AnalyticsCrawlingStatus;
