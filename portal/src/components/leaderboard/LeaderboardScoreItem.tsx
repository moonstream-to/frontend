import React from "react";
import { Flex, Text, Spacer } from "@chakra-ui/react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const LeaderboardScoreItem = ({ score, pointsData }: { score: any; pointsData: any }) => {
  const [showBreakdown, setShowBreakdown] = React.useState<boolean>(false);

  const sortPoints = (points: any) => {
    const specialKeys = ["uncommon_upgrade", "rare_upgrade", "epic_upgrade", "legendary_upgrade"];
    const newPoints: any = {};
    const keyList = Object.keys(points);
    specialKeys.forEach((key) => {
      if (points[key]) {
        newPoints[key] = points[key];
      }
    });
    keyList.forEach((key) => {
      if (!specialKeys.includes(key)) {
        newPoints[key] = points[key];
      }
    });
    return newPoints;
  };

  return (
    <Flex width="100%" justifyContent="space-between">
      <Flex align="center">
        <Text mr="10px">{score}</Text>
        <Flex
          onMouseEnter={(e) => {
            setShowBreakdown(true);
          }}
          onMouseLeave={(e) => {
            setShowBreakdown(false);
          }}
        >
          <AiOutlineQuestionCircle />
        </Flex>
        <Flex display={showBreakdown ? "block" : "none"} ml="-400px" mt="-400px">
          <Flex
            w="300px"
            border="1px solid white"
            bgColor="#232323"
            rounded="md"
            p="10px"
            position="absolute"
            flexDir="column"
          >
            <Text>Score Details</Text>
            {Object.keys(sortPoints(pointsData)).map((key: any, idx: any) => {
              return (
                <Flex key={idx}>
                  <Text fontSize="md">{key}</Text>
                  <Spacer />
                  <Text>{pointsData[key]}</Text>
                </Flex>
              );
            })}
            <Flex borderTop="2px solid #fff" my="10px" />
            <Flex>
              <Text>Score</Text>
              <Spacer />
              <Text>{score}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LeaderboardScoreItem;
