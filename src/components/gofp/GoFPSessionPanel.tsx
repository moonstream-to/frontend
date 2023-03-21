import React, { useContext, useEffect, useState } from "react"
import { Flex, Center, Text } from "@chakra-ui/react"
import StagePanel from "./GoFPStagePanel"
import Connections from "./Connections"
import ResizeObserver from "rc-resize-observer"
import Web3Context from "../../contexts/Web3Context/context"
import useGofpContract from "../../hooks/useGofpConract"
import useGofp from "../../contexts/GoFPContext"

const SessionPanel = () => {
  const [connectionsData, setConnectionsData] = useState<{
    links: { source: string; target: string }[]
    futureLinks: { sources: string[]; targets: string[] }[]
  }>({
    links: [],
    futureLinks: [],
  })

  const { gardenContractAddress, sessionId } = useGofp()
  const web3ctx = useContext(Web3Context)

  const { generatePathId } = useGofp()
  const { currentStage, sessionMetadata, correctPaths } = useGofpContract({
    sessionId,
    gardenContractAddress,
    web3ctx,
  })

  useEffect(() => {
    if (correctPaths.data && currentStage.data && sessionMetadata.data?.stages) {
      const correctPathsZB = correctPaths.data.map((path: number) => path - 1)
      const currentStageZB = currentStage.data - 1
      const links = []
      for (let i = 0; i < correctPathsZB.length - 1; i += 1) {
        links.push({
          source: generatePathId(i, correctPathsZB[i]),
          target: generatePathId(i + 1, correctPathsZB[i + 1]),
        })
      }
      const lastDoor = generatePathId(
        correctPathsZB.length - 1,
        correctPathsZB[correctPathsZB.length - 1],
      )
      const newFutureStages: { sources: string[]; targets: string[] }[] = []
      if (currentStage.data <= sessionMetadata.data.stages.length) {
        for (let i = currentStageZB - 1; i < sessionMetadata.data.stages.length - 1; i += 1) {
          if (i === -1) {
            continue
          }
          const futureStage: { sources: string[]; targets: string[] } = {
            sources: [],
            targets: [],
          }
          for (let j = 0; j < sessionMetadata.data.stages[i].paths.length; j += 1) {
            futureStage.sources.push(generatePathId(i, j))
          }
          for (let j = 0; j < sessionMetadata.data.stages[i + 1].paths.length; j += 1) {
            futureStage.targets.push(generatePathId(i + 1, j))
          }
          newFutureStages.push(futureStage)
        }
        if (currentStageZB > 0) {
          newFutureStages[0].sources = newFutureStages[0].sources.filter((s) => s === lastDoor)
        }
      }
      setConnectionsData({ links, futureLinks: newFutureStages })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctPaths.data, sessionMetadata.data, currentStage.data])

  const [containerWidth, setContainerWidth] = useState(0)

  const handleResize = ({ width }: { width: number }) => {
    setContainerWidth(width)
  }

  return (
    <ResizeObserver onResize={handleResize}>
      <Flex
        flexDirection="column"
        onScroll={() => {
          console.log("scrolling")
        }}
        maxWidth="700px"
        position="relative"
      >
        <Connections
          links={connectionsData.links}
          futureStages={connectionsData.futureLinks}
          offsets={{ top: { x: 0, y: 0.055 }, bottom: { x: 0, y: -0.055 } }}
          width={containerWidth}
        />
        <Center>
          <Text fontSize="lg" pb={10}>
            {sessionMetadata.data?.title}
          </Text>
        </Center>
        {sessionMetadata.data?.stages.map((stage, stageIdx) => {
          return (
            <Center key={stageIdx}>
              <StagePanel stageIdx={stageIdx}></StagePanel>
            </Center>
          )
        })}
      </Flex>
    </ResizeObserver>
  )
}

export default SessionPanel
