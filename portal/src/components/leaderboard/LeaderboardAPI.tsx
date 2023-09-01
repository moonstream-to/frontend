import { Box } from "@chakra-ui/react";
import APIMethod from "./APIMethod";

const LeaderboardAPI = ({ id }: { id: string }) => {
  return (
    <Box maxH="500px" overflow="scroll">
      <APIMethod
        id={id}
        methodTitle={"Get leaderboard info"}
        methodDescription={"Return public information about leaderboard."}
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/info?leaderboard_id=${id}`}
      />
      <APIMethod
        id={id}
        methodTitle={"Get leaderboard positions"}
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
          {
            name: "limit (default=10)",
            description: "Id of your leaderboard",
          },
          {
            name: "offset (default=0)",
            description: "Id of your leaderboard",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/?leaderboard_id=${id}&limit=10&offset=0`}
      />
      <APIMethod
        id={id}
        methodTitle={"Get quartiles"}
        methodDescription={"Return positions of leaderboard on edges of 25%, 50%, 75% percentile."}
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/quartiles/?leaderboard_id=${id}`}
      />
      <APIMethod
        id={id}
        methodTitle={"Get count of positions in leaderboards:"}
        methodDescription={"Return number of positions in leaderboard."}
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/count/addresses/?leaderboard_id=${id}`}
      />
      <APIMethod
        id={id}
        methodTitle={"Get position in leaderboards"}
        methodDescription={
          "Return position of particular address in leaderboard with ability to get closes positions(amount of position setted by window_size parameter which get you ability see +x /-x position from address current possition)."
        }
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
          {
            name: "address",
            description: "address of user which you want to see",
          },
          {
            name: "limit (default=10)",
            description: "Id of your leaderboard",
          },
          {
            name: "offset (default=0)",
            description: "Id of your leaderboard",
          },
          {
            name: "normalize_addresses (default=True)",
            description: "whether to apply toCheckSumAddress",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/position/?leaderboard_id=${id}&address=<address>`}
      />
      <APIMethod
        id={id}
        methodTitle={"Get ranks of leaderboard"}
        methodDescription={"Return information about ranks bucket(size, score) in leaderboars."}
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/ranks?leaderboard_id=${id}`}
      />
      <APIMethod
        id={id}
        methodTitle={"Get rank of leaderboard"}
        methodDescription={"Return positions in particular rank."}
        parameterList={[
          {
            name: "leaderboard_id",
            description: "Id of your leaderboard",
          },
          {
            name: "rank (default=1)",
            description: "rank you want to see",
          },
          {
            name: "limit (default=None)",
            description: "number of records",
          },
          {
            name: "offset (default=None)",
            description: "offset of position in results",
          },
        ]}
        endpoint={`GET https://engineapi.moonstream.to/leaderboard/rank?leaderboard_id=${id}`}
      />
    </Box>
  );
};

export default LeaderboardAPI;
