import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";

import { Box, Heading, Flex, Text, Button, Spacer, Input } from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

import http from "../../utils/httpMoonstream";
import LeaderboardMetadata from "./LeaderboardMetadata";
import NewLeaderboard from "./NewLeaderboard";
import EditLeaderboard from "./EditLeaderboard";
import LeaderboardAPI from "./LeaderboardAPI";

import LeaderboardUpload from "./LeaderboardUpload";
import { Score } from "./types";

const LeaderboardAdminView = () => {
  const [selectedId, setSelectedId] = React.useState("");
  const [status, setStatus] = React.useState("normal");
  const [filter, setFilter] = useState("");
  const filterListFn = (leaderboard: { title: string; description: string }) => {
    return leaderboard.title.includes(filter) || leaderboard.description.includes(filter);
  };

  const getLeaderboards = () => {
    return http({
      method: "GET",
      url: "https://engineapi.moonstream.to/leaderboard/leaderboards",
    }).then((res: any) => {
      return res.data.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    });
  };

  const leaderboardsQuery = useQuery(["leaderboards"], getLeaderboards, {
    onSuccess: (data: any) => {
      if (!selectedId && data[0]?.id) {
        setSelectedId(data[0].id);
      }
    },
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
    ["selectedLeaderboard", leaderboardsQuery.data, selectedId],
    () => {
      return leaderboardsQuery.data.find((l: { id: string }) => l.id === selectedId);
    },
    {
      enabled: !!leaderboardsQuery.data && !!selectedId,
    },
  );

  const lastUpdate = useQuery(
    ["lastUpdate", leaderboardsQuery.data, selectedId],
    async () => {
      const leaderboard = leaderboardsQuery.data.find((l: any) => l.id === selectedId);
      const info = await getLeaderboardInfo(leaderboard.id);
      return info.last_updated_at;
    },
    {
      enabled: !!leaderboardsQuery.data && !!selectedId,
    },
  );

  const refetchLeaderboardData = async () => {
    await leaderboardsQuery.refetch();
    await lastUpdate.refetch();
  };

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

              <Box m="10px" h="500px" overflow="auto">
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="search"
                  borderRadius="10px"
                  p="8px 15px"
                  mt={"20px"}
                  w={"100%"}
                  mb={"15px"}
                />
                {leaderboardsQuery.data
                  ?.filter(filterListFn)
                  .map((leaderboard: any, index: number) => {
                    return (
                      <Flex
                        key={leaderboard.id}
                        p={leaderboard.id === selectedId ? "9px" : "10px"}
                        border={leaderboard.id === selectedId ? "1px solid #FFF" : "none"}
                        rounded="lg"
                        bgColor={leaderboard.id == selectedId ? "#353535" : "auto"}
                        cursor={"pointer"}
                        onClick={() => {
                          setSelectedId(leaderboard.id);
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
              isDisabled={status === "create"}
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
              onSuccess={(id) => {
                setStatus("normal");
                setSelectedId(id);
              }}
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
