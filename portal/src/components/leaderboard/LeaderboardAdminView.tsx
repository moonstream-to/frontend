import React from "react";
import { useQuery, useMutation } from "react-query";

import { Box, Heading, Flex, Text, Button, Spacer } from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

import http from "../../utils/httpMoonstream";
import LeaderboardMetadata from "./LeaderboardMetadata";
import NewLeaderboard from "./NewLeaderboard";
import EditLeaderboard from "./EditLeaderboard";
import LeaderboardAPI from "./LeaderboardAPI";

import LeaderboardUpload from "./LeaderboardUpload";
import { Score } from "./types";

const LeaderboardAdminView = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [status, setStatus] = React.useState("normal");

  const getLeaderboards = () => {
    return http({
      method: "GET",
      url: "https://engineapi.moonstream.to/leaderboard/leaderboards",
    }).then((res: any) => {
      return res.data.sort((a: any, b: any) => {
        return b.created_at > a.created_at;
      });
    });
  };

  const leaderboardsQuery = useQuery(["leaderboards"], getLeaderboards, {
    onError: (e) => {
      console.log(e);
    },
  });

  const getLeaderboardInfo = (id: string) => {
    return http({
      method: "GET",
      url: `https://engineapi.moonstream.to/leaderboard/info?leaderboard_id=${id}`,
    }).then((res: any) => {
      return res.data;
    });
  };

  const selectedLeaderboard = useQuery(
    ["selectedLeaderboard", leaderboardsQuery.data, selectedIndex],
    () => {
      const leaderboard = leaderboardsQuery.data[selectedIndex];
      return leaderboard;
    },
    {
      enabled: !!leaderboardsQuery.data,
    },
  );

  const lastUpdate = useQuery(
    ["lastUpdate", leaderboardsQuery.data, selectedIndex],
    async () => {
      const leaderboard = leaderboardsQuery.data[selectedIndex];
      const info = await getLeaderboardInfo(leaderboard.id);
      return info.last_updated_at;
    },
    {
      enabled: !!leaderboardsQuery.data,
    },
  );

  const refetchLeaderboardData = async () => {
    await leaderboardsQuery.refetch();
    await lastUpdate.refetch();
  };

  const create = async (title: string, description: string) => {
    return await http({
      method: "POST",
      url: `https://engineapi.moonstream.to/leaderboard`,
      data: {
        title: title,
        description: description,
      },
    }).then(async (res: any) => {
      await refetchLeaderboardData();
    });
  };

  const createLeaderboard = useMutation(
    ({ title, description }: { title: string; description: string }) => create(title, description),
    {
      onSuccess: () => {
        setStatus("normal");
      },
    },
  );

  const update = async (id: string, title: string, description: string) => {
    return await http({
      method: "PUT",
      url: `https://engineapi.moonstream.to/leaderboard/${id}`,
      data: {
        title: title,
        description: description,
      },
    }).then(async (res: any) => {
      await refetchLeaderboardData();
      return res;
    });
  };

  const updateLeaderboard = useMutation(
    ({ id, title, description }: { id: string; title: string; description: string }) =>
      update(id, title, description),
    {
      onSuccess: () => {
        setStatus("normal");
      },
    },
  );

  const pushScores = async (id: string, scores: Score[]) => {
    return await http({
      method: "PUT",
      url: `https://engineapi.moonstream.to/leaderboard/${id}/scores?normalize_addresses=false&overwrite=true`,
      data: scores,
    }).then(async (res: any) => {
      await refetchLeaderboardData();
      return res;
    });
  };

  const pushLeaderboardScores = useMutation(({ id, scores }: { id: string; scores: Score[] }) =>
    pushScores(id, scores),
  );

  const panelBackground = "#2D2D2D";
  const minHeight = "550px";

  return (
    <Box
      className="Dashboard"
      py={["10px", "20px", "30px"]}
      p={{ base: "5px", sm: "15px" }}
      bgColor="#1A1D22"
      w="100%"
      maxW="1200px"
    >
      <Flex>
        <Flex
          w="400px"
          minH={minHeight}
          bgColor={panelBackground}
          m="20px"
          p="20px"
          rounded="lg"
          flexDir="column"
        >
          <Box>
            <Box>
              <Heading fontSize={["lg", "2xl"]}>Leaderboards</Heading>
              <Box m="10px" h="500px" overflow="scroll">
                {leaderboardsQuery.data?.map((leaderboard: any, index: number) => {
                  return (
                    <Flex
                      key={leaderboard.id}
                      p="10px"
                      rounded="lg"
                      bgColor={index == selectedIndex ? "#4D4D4D" : "auto"}
                      onClick={() => {
                        setSelectedIndex(index);
                      }}
                    >
                      <Text>{leaderboard.title}</Text>
                    </Flex>
                  );
                })}
              </Box>
            </Box>
          </Box>
          <Spacer />
          <Box>
            <Button
              w="100%"
              h="40px"
              bgColor="#FFFFFF"
              color="#232323"
              leftIcon={<AddIcon w="8px" h="8px" />}
              onClick={() => {
                setStatus("create");
              }}
            >
              Add new leaderboard
            </Button>
          </Box>
        </Flex>
        <Flex
          w="800px"
          minH={minHeight}
          bgColor={panelBackground}
          m="20px"
          p="20px"
          rounded="lg"
          flexDir="column"
          gap="20px"
        >
          {selectedLeaderboard.data && (
            <>
              {status == "normal" && (
                <>
                  <LeaderboardMetadata
                    leaderboard={selectedLeaderboard.data}
                    lastUpdate={lastUpdate}
                    handleEdit={() => {
                      setStatus("edit");
                    }}
                  />
                  <LeaderboardUpload
                    id={selectedLeaderboard.data.id}
                    pushLeaderboardScores={pushLeaderboardScores}
                  />
                  <LeaderboardAPI id={selectedLeaderboard.data.id} />
                </>
              )}
              {status == "edit" && (
                <EditLeaderboard
                  leaderboard={selectedLeaderboard.data}
                  updateLeaderboard={updateLeaderboard}
                  onClose={() => {
                    setStatus("normal");
                  }}
                />
              )}
            </>
          )}
          {status == "create" && (
            <NewLeaderboard
              createLeaderboard={createLeaderboard}
              onClose={() => {
                setStatus("normal");
              }}
            />
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default LeaderboardAdminView;
