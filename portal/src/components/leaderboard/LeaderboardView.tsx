/* eslint-disable @typescript-eslint/no-var-requires */
import { useRouter } from "next/router";

import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import LeaderboardRank from "./LeaderboardRank";
import LeaderboardScoreItem from "./LeaderboardScoreItem";
import LeaderboardAddressItem from "./LeaderboardAddressItem";
import UserWeb3AddressInput from "../UserWeb3AddressInput";

import {
  Box,
  Heading,
  Flex,
  Text,
  Spinner,
  HStack,
  GridItem,
  UnorderedList,
  ListItem,
  useMediaQuery,
} from "@chakra-ui/react";

import Web3 from "web3";

import http from "../../utils/http";
import queryCacheProps from "../../hooks/hookCommon";
import Web3Context from "../../contexts/Web3Context/context";
import LeaderboardPaginator from "./LeaderboardPaginator";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const LeaderboardView = () => {
  const router = useRouter();
  const [leaderboardId, setLeaderboardId] = useState("");
  const [limit, setLimit] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [currentAccount, setCurrentAccount] = React.useState(ZERO_ADDRESS);
  const web3ctx = useContext(Web3Context);

  const [isVerySmallScreen, isSmallScreen] = useMediaQuery([
    "(max-width: 440px)",
    "(max-width: 810px)",
  ]);

  useEffect(() => {
    setLeaderboardId(
      typeof router.query.leaderboardId === "string" ? router.query.leaderboardId : "",
    );
  }, [router.query.leaderboardId]);

  // Boomland: 56d5ecc4-b214-4af5-b320-d56cd5fbc3da
  const fetchLeaders = async (id: string, pageLimit: number, pageOffset: number) => {
    return http(
      {
        method: "GET",
        url: `https://engineapi.moonstream.to/leaderboard/?leaderboard_id=${id}&limit=${pageLimit}&offset=${pageOffset}`,
      },
      true,
    );
  };

  const fetchAddressWindow = async (id: string, address: string) => {
    return http(
      {
        method: "GET",
        url: `https://engineapi.moonstream.to/leaderboard/position/?leaderboard_id=${id}&address=${address}`,
      },
      true,
    );
  };

  const leaders = useQuery(
    ["fetch_leaders", leaderboardId, limit, offset],
    () => {
      return fetchLeaders(leaderboardId, limit, offset).then((res) => {
        return res.data;
      });
    },
    {
      ...queryCacheProps,
      keepPreviousData: true,
      enabled: !!leaderboardId,
    },
  );

  const fetchLength = async (id: string) => {
    return http(
      {
        method: "GET",
        url: `  https://engineapi.moonstream.to/leaderboard/count/addresses/?leaderboard_id=${id}`,
      },
      true,
    );
  };

  const leadersLength = useQuery(
    ["leadersLength", leaderboardId],
    () => {
      return fetchLength(leaderboardId).then((res) => {
        return res.data.count;
      });
    },
    {
      ...queryCacheProps,
      enabled: !!leaderboardId,
    },
  );

  const windowAroundAddress = useQuery(
    ["fetch_address_window", leaderboardId, currentAccount],
    () => {
      if (currentAccount != "" && currentAccount != ZERO_ADDRESS) {
        return fetchAddressWindow(leaderboardId, currentAccount).then((res) => {
          return res.data;
        });
      } else {
        return [];
      }
    },
    {
      ...queryCacheProps,
      enabled: !!leaderboardId,
    },
  );

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
      maxW="1200px"
    >
      <Flex
        borderRadius="20px"
        bgColor={panelBackground}
        p={[2, 4, 10]}
        direction="column"
        fontSize={{ base: "12px", sm: "16px", md: "18px" }}
      >
        <Flex alignItems="center" direction={["column", "column", "row"]}>
          <HStack>
            <Heading fontSize={["lg", "2xl"]}>Boomland Leaderboard</Heading>
          </HStack>
        </Flex>
        <Box my={["10px", "20px", "30px"]} fontSize={["14px", "14px", "18px"]}>
          <Text>Scoring: </Text>
          <UnorderedList>
            <ListItem>
              Upgrade - uncommon upgrades worth 10 points, rare 20, epic 50, legendary 100
            </ListItem>
            <ListItem>Opening chest - price of chest divided by 100.</ListItem>
            <ListItem>Earning bgem - 1 point per 1k earned</ListItem>
            <ListItem>
              Getting a shard - 1 point for common, 5 points for uncommon, 6 points for rare, 7
              points for epic, 10 points for legendary.
            </ListItem>
            <ListItem>
              Getting equipment - 1 point for common, 5 points for uncommon, 6 points for rare, 7
              points for epic, 10 point for legendary.
            </ListItem>
            <ListItem>
              Getting an artifact - 1 point for common, 5 points for uncommon, 6 points for rare, 7
              points for epic, 10 point for legendary.
            </ListItem>
          </UnorderedList>
        </Box>
        <Box
          w="100%"
          px={{ base: "5px", sm: "20px" }}
          py="10px"
          mb="30px"
          fontWeight="700"
          border="3px solid white"
          borderWidth={{ base: "1px", sm: "2px", md: "3px" }}
          bgColor="#232323"
          rounded="lg"
        >
          <UserWeb3AddressInput
            value={currentAccount}
            setAddress={setCurrentAccount}
            showInvalid={true}
            column={isSmallScreen}
            fontSize={isVerySmallScreen ? "10px" : "14px"}
          />
          <Flex
            textAlign="left"
            width="100%"
            justifyContent="space-between"
            p={["5px", "5px", "10px"]}
            my="10px"
            alignItems="center"
            borderBottom="1px solid white"
            fontSize={["12px", "14px", "20px"]}
          >
            <GridItem maxW={["45px", "45px", "125px"]} minW={["45px", "45px", "125px"]}>
              Rank
            </GridItem>
            <GridItem mr="auto">Player</GridItem>
            <GridItem
              maxW={["50px", "50px", "120px", "200px"]}
              minW={["50px", "50px", "120px", "200px"]}
              textAlign="end"
            >
              Score
            </GridItem>
          </Flex>
          {windowAroundAddress.data ? (
            <Flex flexDir="column">
              {windowAroundAddress.data.map((item: any, idx: number) => {
                return (
                  <Flex
                    textAlign="left"
                    width="100%"
                    bgColor={item.address == currentAccount ? "#454545" : "inherit"}
                    justifyContent="space-between"
                    py={["5px", "5px", "10px"]}
                    alignItems="center"
                    key={idx}
                  >
                    <GridItem maxW={["45px", "45px", "125px"]} minW={["45px", "45px", "125px"]}>
                      <LeaderboardRank rank={item.rank} />
                    </GridItem>
                    <GridItem width="100%" fontWeight="700" mr="10px">
                      <LeaderboardAddressItem
                        address={item.address}
                        trimAddress={isVerySmallScreen}
                      />
                    </GridItem>
                    <GridItem
                      my="auto"
                      maxW={["50px", "50px", "120px", "200px"]}
                      minW={["50px", "50px", "120px", "200px"]}
                    >
                      <LeaderboardScoreItem score={item.score} pointsData={item.points_data} />
                    </GridItem>
                  </Flex>
                );
              })}
              {windowAroundAddress.data.length == 0 && (
                <Text>No leaderboard information for account {currentAccount}</Text>
              )}
            </Flex>
          ) : (
            <Spinner alignSelf="center" color="#bfbfbf" />
          )}
        </Box>
        <Box>
          <Flex
            textAlign="left"
            width="100%"
            justifyContent="space-between"
            py={["5px", "5px", "10px"]}
            alignItems="center"
            borderBottom="1px solid white"
            fontSize={["12px", "14px", "20px"]}
            fontWeight="700"
          >
            <GridItem maxW={["45px", "45px", "125px"]} minW={["45px", "45px", "125px"]}>
              Rank
            </GridItem>
            <GridItem mr="auto">Player</GridItem>
            <GridItem
              maxW={["50px", "50px", "120px", "200px"]}
              minW={["50px", "50px", "120px", "200px"]}
              textAlign="end"
            >
              Score
            </GridItem>
          </Flex>
          {leaders.data ? (
            <Flex flexDir="column">
              {leaders.data.map((item: any, idx: number) => {
                return (
                  <Flex
                    textAlign="left"
                    width="100%"
                    bgColor={item.address == currentAccount ? "#454545" : "inherit"}
                    justifyContent="space-between"
                    py={["5px", "5px", "10px"]}
                    alignItems="center"
                    key={idx}
                  >
                    <GridItem maxW={["45px", "45px", "125px"]} minW={["45px", "45px", "125px"]}>
                      <LeaderboardRank rank={item.rank} />
                    </GridItem>
                    <GridItem width="100%" fontWeight="400" mr="10px">
                      <LeaderboardAddressItem
                        address={item.address}
                        trimAddress={isVerySmallScreen}
                      />
                    </GridItem>
                    <GridItem
                      my="auto"
                      fontWeight="400"
                      maxW={["50px", "50px", "120px", "200px"]}
                      minW={["50px", "50px", "120px", "200px"]}
                    >
                      <LeaderboardScoreItem score={item.score} pointsData={item.points_data} />
                    </GridItem>
                  </Flex>
                );
              })}
            </Flex>
          ) : (
            <Spinner alignSelf="center" color="#bfbfbf" />
          )}
        </Box>
        {leadersLength.data && (
          <LeaderboardPaginator
            onOffsetChange={setOffset}
            onPageSizeChange={setLimit}
            count={leadersLength.data}
          />
        )}
      </Flex>
    </Box>
  );
};

export default LeaderboardView;
