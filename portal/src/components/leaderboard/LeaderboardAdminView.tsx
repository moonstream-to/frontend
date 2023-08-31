/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router";

import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import {
  Box,
  Heading,
  Flex,
  Text,
  Button,
  Input,
  Spinner,
  HStack,
  GridItem,
  UnorderedList,
  ListItem,
  useMediaQuery,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { FiEdit2 } from "react-icons/fi";

import Web3 from "web3";

import http from "../../utils/httpMoonstream";
import queryCacheProps from "../../hooks/hookCommon";
import Web3Context from "../../contexts/Web3Context/context";
import LeaderboardMetadata from "./LeaderboardMetadata";
import NewLeaderboard from "./NewLeaderboard";
import EditLeaderboard from "./EditLeaderboard";
import LeaderboardAPI from "./LeaderboardAPI";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useMoonToast from "../../hooks/useMoonToast";
import LeaderboardUpload from "./LeaderboardUpload";
import { Score } from "./types";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const LeaderboardAdminView = () => {
  const router = useRouter();
  const toast = useMoonToast();
  const [currentAccount, setCurrentAccount] = React.useState(ZERO_ADDRESS);
  const web3ctx = useContext(Web3Context);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [status, setStatus] = React.useState("normal");
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isVerySmallScreen, isSmallScreen] = useMediaQuery([
    "(max-width: 440px)",
    "(max-width: 810px)",
  ]);

  const getLeadeerboards = () => {
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

  const leaderboardsQuery = useQuery(["leaderboards"], getLeadeerboards, {
    onSuccess: (data) => {
      console.log(data);
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
    ["selectedLeaderboard", leaderboardsQuery, selectedIndex],
    () => {
      if (!leaderboardsQuery.data) {
        return;
      } else {
        const leaderboard = leaderboardsQuery.data[selectedIndex];
        setTitle(leaderboard.title);
        setDescription(leaderboard.description);
        return leaderboard;
      }
    },
  );

  const lastUpdate = useQuery(["lastUpdate", leaderboardsQuery, selectedIndex], async () => {
    if (!leaderboardsQuery.data) {
      return;
    } else {
      const leaderboard = leaderboardsQuery.data[selectedIndex];
      const info = await getLeaderboardInfo(leaderboard.id);
      console.log(info);
      return info.last_updated_at;
    }
  });

  const refetchLeaderboardData = async () => {
    await leaderboardsQuery.refetch();
    await lastUpdate.refetch();
  };

  const createLeaderboard = async (title: string, description: string) => {
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

  const updateLeaderboard = async (id: string, title: string, description: string) => {
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

  const pushLeaderboardScores = async (id: string, content: Score[]) => {
    return await http({
      method: "PUT",
      url: `https://engineapi.moonstream.to/leaderboard/${id}/scores?normalize_addresses=false&overwrite=true`,
      data: content,
    }).then(async (res: any) => {
      await refetchLeaderboardData();
      return res;
    });
  };

  useEffect(() => {
    if (Web3.utils.isAddress(web3ctx.account)) {
      setCurrentAccount(web3ctx.account);
    }
  }, [web3ctx.account]);

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
                    handleScores={async (scores: Score[]) => {
                      return await pushLeaderboardScores(selectedLeaderboard.data.id, scores);
                    }}
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
              {status == "create" && (
                <NewLeaderboard
                  handleCreate={async (title: string, description: string) => {
                    await createLeaderboard(title, description);
                  }}
                  onClose={() => {
                    setStatus("normal");
                  }}
                />
              )}
              {status == "edit" && (
                <EditLeaderboard
                  leaderboard={selectedLeaderboard.data}
                  handleEdit={async (id: string, title: string, description: string) => {
                    await updateLeaderboard(id, title, description);
                  }}
                  onClose={() => {
                    setStatus("normal");
                  }}
                />
              )}
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default LeaderboardAdminView;
