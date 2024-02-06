import React, { useState } from "react";
import { Box, Flex, Grid, Input, Text } from "@chakra-ui/react";

const defaultColors = [
  "#2f38c0",
  "#5f64cf",
  "#8c91dc",
  "#d2d3f0",
  "#ffffff",
  "#f4d2cf",
  "#e38b87",
  "#d65c5a",
];

const mockLocations = [
  19, 11, 5, 1, 2, 45, 29, 13, 8, 6, 70, 59, 47, 23, 12, 40, 35, 40, 32, 31, 11, 12, 23, 24, 34,
];

const counts = mockLocations;
const total = counts.reduce((acc, value) => acc + value);
const rates = counts.map((value) => value / total);

const HeatMap = ({
  isPitcher,
  showStrikeZone = false,
}: {
  showStrikeZone?: boolean;
  isPitcher: boolean;
}) => {
  const [showMode, setShowMode] = useState(0);
  const [colors, setColors] = useState(defaultColors);

  function interpolateColor(color1: string, color2: string, factor = 0.5): string {
    const result: string[] = color1
      .slice(1)
      .match(/.{2}/g)!
      .map((hexNum, index) => {
        const color1Num: number = parseInt(hexNum, 16);
        const color2Num: number = parseInt(color2.slice(1).match(/.{2}/g)![index], 16);
        const diff: number = color2Num - color1Num;
        const newNum: number = color1Num + Math.round(diff * factor);
        return newNum.toString(16).padStart(2, "0");
      });
    return `#${result.join("")}`;
  }

  function valueToColor(value: number, values: number[]): string {
    const normValue = value / Math.max(...values);
    const segment: number = 1 / (colors.length - 1);
    const index: number = Math.min(Math.floor(normValue / segment), colors.length - 2);
    const factor: number = (normValue % segment) / segment;
    return interpolateColor(colors[index], colors[index + 1], factor);
  }

  const leftBorder = [6, 11, 16];
  const topBorder = [6, 7, 8];
  const rightBorder = [8, 13, 18];
  const bottomBorder = [16, 17, 18];

  const generateCell = (index: number) => (
    <Box
      p={"2px"}
      border={"1px solid #aaa"}
      borderLeftStyle={leftBorder.includes(index) && showStrikeZone ? "solid" : "none"}
      borderRightStyle={rightBorder.includes(index) && showStrikeZone ? "solid" : "none"}
      borderTopStyle={topBorder.includes(index) && showStrikeZone ? "solid" : "none"}
      borderBottomStyle={bottomBorder.includes(index) && showStrikeZone ? "solid" : "none"}
    >
      <Box
        key={index}
        height="20px"
        width="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor={"pointer"}
        bg={valueToColor(rates[index], rates ?? "#111111")}
        borderRadius={"3px"}
        onClick={() => setShowMode(showMode === 2 ? 0 : showMode + 1)}
      >
        {showMode !== 0 && (
          <Text fontSize={"6px"} color={"black"} fontWeight={"400"}>
            {showMode === 1 ? (rates[index] * 100).toFixed(2) : counts[index]}
          </Text>
        )}
      </Box>
    </Box>
  );

  return (
    <Flex direction={"column"}>
      <Flex direction={"column"} alignItems={"center"} gap={"10px"} minH={"150px"} mt={"80px"}>
        <Grid templateColumns="repeat(5, 1fr)" w={"fit-content"}>
          {Array.from({ length: 25 }).map((_, i) => generateCell(i))}
        </Grid>
        {showMode !== 0 && (
          <Text fontSize={"10px"}>
            Total: {counts.reduce((acc, c) => acc + c)}
            {isPitcher ? " pitches" : " swings"}
          </Text>
        )}
      </Flex>
      <Flex mt={"40px"} mx={"auto"}>
        {colors.map((color, idx) => (
          <Flex key={idx}>
            <Input
              value={color}
              color={"#999"}
              borderColor={"#999"}
              w={"100px"}
              onChange={(e) => setColors(colors.map((c, j) => (j === idx ? e.target.value : c)))}
            />
            <Box w={"75px"} h={"100%"} bg={color} borderRadius={"5px"} />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default HeatMap;
