import React from "react";
import { useQuery, useMutation } from "react-query";

import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

import http from "../../utils/httpMoonstream";
import LeaderboardMetadata from "./LeaderboardMetadata";
import NewLeaderboard from "./NewLeaderboard";
import EditLeaderboard from "./EditLeaderboard";
import LeaderboardAPI from "./LeaderboardAPI";

import LeaderboardUpload from "./LeaderboardUpload";
import { Score } from "./types";
import { useToast } from "../../hooks";

const LeaderboardAdminView = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [status, setStatus] = React.useState("normal");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const getLeaderboards = () => {
    return http({
      method: "GET",
      url: "https://engineapi.moonstream.to/leaderboard/leaderboards",
    }).then((res: any) => {
      res.data.sort((a: any, b: any) => {
        return b.created_at > a.created_at;
      });
      return res.data;
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
          minH="720px"
          bgColor={panelBackground}
          m="20px"
          p="20px"
          rounded="lg"
          flexDir="column"
        >
          <Box>
            <Box>
              <Heading fontSize={["lg", "2xl"]}>Leaderboards</Heading>
              <Box m="10px">
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
          minH="720px"
          bgColor={panelBackground}
          m="20px"
          p="20px"
          rounded="lg"
          flexDir="column"
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
                  <Button
                    my="20px"
                    bgColor="#FFFFFF"
                    color="#232323"
                    alignSelf="center"
                    onClick={onOpen}
                  >
                    Show leaderboard API
                  </Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent
                      bg="#2D2D2D"
                      border="1px solid white"
                      borderRadius="20px"
                      textColor="white"
                      mx="15px"
                      maxW="500px"
                    >
                      <ModalHeader fontSize="18px" fontWeight="900">
                        Leaderboard API
                      </ModalHeader>
                      <ModalBody>
                        <LeaderboardAPI id={selectedLeaderboard.data.id} />
                      </ModalBody>
                    </ModalContent>
                  </Modal>
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
