import React, { useContext } from "react"
import { Flex, Center } from "@chakra-ui/react"
import PathCard from "./GoFPPathCard"
import useGofp from "../../contexts/GoFPContext"
import useGofpContract from "../../hooks/useGofpConract"
import Web3Context from "../../contexts/Web3Context/context"

const StagePanel = ({ stageIdx }: { stageIdx: number }) => {
  const { generatePathId, selectStage, sessionId, gardenContractAddress } = useGofp()

  const web3ctx = useContext(Web3Context)
  const { sessionMetadata, currentStage } = useGofpContract({
    sessionId,
    gardenContractAddress,
    web3ctx,
  })

  // const getPathStatus = (pathIdx: number) => {
  //   if (completed) {
  //     if (pathIdx + 1 == correctPath) {
  //       return PathStatus.correct;
  //     } else {
  //       return PathStatus.incorrect;
  //     }
  //   } else {
  //     return PathStatus.undecided;
  //   }
  // };

  return (
    <Flex
      flexDirection="column"
      pb={10}
      zIndex={1}
      onClick={() => {
        selectStage(stageIdx + 1)
      }}
    >
      <Flex flexDirection="row" alignItems="center">
        {sessionMetadata.data?.stages[stageIdx].paths.map((path, pathIdx) => {
          return (
            <Center key={pathIdx}>
              <PathCard
                accept={currentStage.data === stageIdx + 1 ? "character" : "none"}
                pathMetadata={path}
                pathIdx={pathIdx}
                stageIdx={stageIdx}
                pathId={generatePathId(stageIdx, pathIdx)}
              ></PathCard>
            </Center>
          )
        })}
      </Flex>
    </Flex>
  )
}

export default StagePanel
