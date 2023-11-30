import React, { useState } from "react";
import { Box, Flex, Grid, Input, Text } from "@chakra-ui/react";

function interpolateColor(color1: string, color2: string, factor = 0.5): string {
  try {
    const hexToRgb = (hex: string): number[] => hex.match(/.{2}/g)!.map((hex) => parseInt(hex, 16));

    const lerp = (start: number, end: number, t: number): number =>
      Math.round(start + t * (end - start));

    const [r1, g1, b1] = hexToRgb(color1.slice(1));
    const [r2, g2, b2] = hexToRgb(color2.slice(1));

    const r = lerp(r1, r2, factor).toString(16).padStart(2, "0");
    const g = lerp(g1, g2, factor).toString(16).padStart(2, "0");
    const b = lerp(b1, b2, factor).toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
  } catch {
    return "red";
  }
}

const defaultColors = [
  "#261c3d",
  "#4a3572",
  "#3d448b",
  "#235aa6",
  "#2a7cbe",
  "#0ca5cf",
  "#0ed1df",
  "#26d6a7",
  "#34ea74",
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

  function getColorByFactor(array: number[], factor: number): string {
    const sortedArray = [...array].sort((a, b) => a - b);
    const bracketIndices = [2, 5, 8, 11, 14, 17, 21, 24];
    const brackets = bracketIndices.map((index) => sortedArray[index]);

    let bracketTopIndex = brackets.findIndex((b) => b >= factor);
    bracketTopIndex = bracketTopIndex === -1 ? 7 : bracketTopIndex;
    const top = brackets[bracketTopIndex];
    const bottom = bracketTopIndex === 0 ? sortedArray[0] : brackets[bracketTopIndex - 1];
    const placeInBracket = top === bottom ? 1 : (factor - bottom) / (top - bottom);
    const endColorIndex = bracketTopIndex + 1;
    return interpolateColor(colors[endColorIndex - 1], colors[endColorIndex], placeInBracket);
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
        bg={getColorByFactor(rates, rates[index] ?? "#111111")}
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
