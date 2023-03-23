import React, { useContext, useEffect, useState } from "react"
import { Flex, Image, Text, Box, Center } from "@chakra-ui/react"
import { useDrop } from "react-dnd"

import { PathMetadata, PathStatus } from "./GoFPTypes"
import useGofp from "../../contexts/GoFPContext"
import Web3Context from "../../contexts/Web3Context/context"
import useGofpContract from "../../hooks/useGofpConract"

const PathCard = ({
  pathIdx,
  pathMetadata,
  pathId,
  accept,
  stageIdx,
}: {
  pathIdx: number
  pathMetadata: PathMetadata
  pathId: string
  accept: string
  stageIdx: number
}) => {
  const correctPathColor = "#3BB563"
  const incorrectPathColor = "#E85858"
  const undecidedPathColor = "#4C4C4C"

  const { selectedPath, selectPath, sessionId, gardenContractAddress } = useGofp()
  const web3ctx = useContext(Web3Context)

  const { choosePath, correctPaths, currentStage } = useGofpContract({
    sessionId,
    gardenContractAddress,
    web3ctx,
  })

  const handleDrop = (item: { id: number }) => {
    const pathNumber = Number(pathId.split("_").slice(-1)[0]) + 1
    choosePath.mutate({ tokenIds: [item.id], path: pathNumber })
  }

  const [status, setStatus] = useState(PathStatus.undecided)
  const [isSelected, setIsSelected] = useState<boolean>(false)

  useEffect(() => {
    if (!correctPaths.data) {
      return
    }
    if (stageIdx < correctPaths.data?.length) {
      setStatus(
        correctPaths.data[stageIdx] === pathIdx + 1 ? PathStatus.correct : PathStatus.incorrect,
      )
    } else {
      setStatus(PathStatus.undecided)
    }
  }, [correctPaths.data, pathIdx, stageIdx])

  useEffect(() => {
    if (stageIdx + 1 === currentStage.data && pathIdx + 1 === selectedPath) {
      setIsSelected(true)
    } else {
      setIsSelected(false)
    }
  }, [selectedPath, pathIdx, stageIdx, currentStage.data])

  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const assets = {
    trophy: "https://s3.amazonaws.com/static.simiotics.com/play/minigames/trophy.png",
    skull: "https://s3.amazonaws.com/static.simiotics.com/play/minigames/skull.png",
    path_into_fog: "https://s3.amazonaws.com/static.simiotics.com/play/minigames/path_into_fog.png",
  }

  let cardFill = ""

  switch (status) {
    case PathStatus.correct:
      cardFill = correctPathColor
      break
    case PathStatus.incorrect:
      cardFill = incorrectPathColor
      break
    case PathStatus.undecided:
      cardFill = undecidedPathColor
      break
    default:
      cardFill = undecidedPathColor
      break
  }

  return (
    <Box
      ref={drop}
      id={pathId}
      px={2}
      onClick={() => {
        if (stageIdx + 1 === currentStage.data) {
          selectPath(pathIdx + 1)
        }
      }}
      fontWeight={canDrop ? "700" : "400"}
    >
      <Flex
        flexDirection="column"
        position="relative"
        w={isSelected ? "130px" : "122.5px"}
        h={isSelected ? "180px" : "170px"}
        alignItems="center"
      >
        <Center position="absolute">
          <svg
            height={isSelected ? "180" : "170"}
            viewBox="0 0 100 138"
            fill={cardFill}
            opacity={isOver && canDrop ? "1" : "0.5"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8.09388C1 8.09388 6.77761 10.0895 6.7459 12.2739C6.69769 15.5947 6.69769 17.3041 6.69769 17.3041L6.69768 120.696C6.69768 120.696 6.69769 122.405 6.7459 125.726C6.77761 127.91 1 129.906 1 129.906L1.67215 136.343L7.6697 137C7.6697 137 9.28032 131.035 11.9902 131.035H88.0098C90.7197 131.035 92.3303 137 92.3303 137L98.3279 136.343L99 129.906C99 129.906 93.2224 127.91 93.2541 125.726C93.3023 122.405 93.3023 120.696 93.3023 120.696V17.3041C93.3023 17.3041 93.3023 15.5947 93.2541 12.2739C93.2224 10.0895 99 8.09388 99 8.09388L98.3279 1.65679L92.3303 1C92.3303 1 90.7197 6.96489 88.0098 6.96489H11.9902C9.28032 6.96489 7.6697 1 7.6697 1L1.67215 1.65679L1 8.09388Z"
              stroke="#FFFFFF"
              strokeWidth={isSelected ? 2 : 1}
            />
          </svg>
        </Center>
        <Box position="relative" h="90px" w="90px">
          <Image
            alt={pathId}
            src={status == PathStatus.correct ? assets["trophy"] : assets["skull"]}
            h="40px"
            w="40px"
            mt="30px"
            ml="25px"
            position="absolute"
            display={status == PathStatus.undecided ? "none" : ""}
          ></Image>
          {pathMetadata.imageUrl.length > 0 ? (
            <Image
              alt={pathId}
              src={pathMetadata.imageUrl}
              h="90px"
              w="90px"
              mt={4}
              border="1px solid"
              borderColor="white"
              position="relative"
              opacity={status == PathStatus.undecided ? 1.0 : 0.4}
            ></Image>
          ) : (
            <Image
              alt={pathId}
              src={assets["path_into_fog"]}
              h="90px"
              w="90px"
              mt={4}
              border="1px solid"
              borderColor="white"
              position="relative"
              opacity={status == PathStatus.undecided ? 1.0 : 0.4}
            ></Image>
          )}
          <Text
            fontSize={isSelected ? "sm" : "xs"}
            fontWeight={isSelected ? "semibold" : "normal"}
            color="white"
            align="center"
            py={2}
          >
            {pathMetadata.title}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default PathCard
