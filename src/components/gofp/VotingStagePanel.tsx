import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useMutation } from "react-query"

import useGofp from "../../contexts/GoFPContext"
import { useToast } from "../../hooks"
import PathCard from "./GoFPPathCard"

const VotingStagePanel = ({stage, currentStage, stageMetadata}: {stage: number, currentStage: number, stageMetadata: any}) => {
  const {generatePathId, selectedPath} = useGofp()
  const toast = useToast()

  const handleClick = useMutation(
    () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve('success'), 1000)
    })
  }, 
  {
    onSuccess: () => toast('Success','success')
  },
  )

  return (
    <Flex direction='column' position='relative' gap='40px' alignItems='center' h='500px' px='30px'>
      <Box position='absolute' >
        <svg
        width="288" 
        height="646" 
        viewBox="0 0 288 646" 
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.9976 34.5001C13.9976 34.5001 13.9976 31.1935 14.0978 24.7699C14.0978 24.7699 19.2665 23.8166 21.5477 21.635C23.7845 19.4959 24.9976 14.5001 24.9976 14.5001C29.9976 14.5001 33.9976 14.5001 33.9976 14.5001"      
            stroke="white"
          />
          <path
            d="M34 14.5H254"  
            stroke="white"  
          />
          <path
            d="M274.002 34.5001C274.002 34.5001 274.002 31.1935 273.902 24.7699C273.902 24.7699 268.734 23.8166 266.452 21.635C264.216 19.4959 263.002 14.5001 263.002 14.5001C258.002 14.5001 254.002 14.5001 254.002 14.5001"
            stroke="white"
          />
          <path
            d="M14 34.5L14 611.5"
            stroke="white"
          />
          <path
            d="M274 34.5L274 611.5"
            stroke="white"
          />
          <path
            d="M13.9976 611.5C13.9976 611.5 13.9976 614.806 14.0978 621.23C14.0978 621.23 19.2665 622.183 21.5477 624.365C23.7845 626.504 24.9976 631.5 24.9976 631.5C29.9976 631.5 33.9976 631.5 33.9976 631.5"
            stroke="white"
          />
          <path
            d="M34 631.5H254"
            stroke="white"
          />
          <path
            d="M274.002 611.5C274.002 611.5 274.002 614.806 273.902 621.23C273.902 621.23 268.734 622.183 266.452 624.365C264.216 626.504 263.002 631.5 263.002 631.5C258.002 631.5 254.002 631.5 254.002 631.5"
            stroke="white"
          />
      </svg>
    </Box>
      <Text 
        mt='40px' 
        p='5px 10px' 
        fontSize='10px'
        borderRadius='10px'
        border='1px solid white'
    >
      {`${stage === currentStage ? 'Active stage - ' : ''}Stage ${stage}`}
    </Text>
    <Flex overflowX='auto' maxW='90%' pb='15px' position='relative'>

      {stageMetadata.paths.map((path: any, idx: number) => {
        return (
          <PathCard
            key={idx}
            pathMetadata={path}
            pathIdx={idx}
            stageIdx={stage - 1}
            accept='none'
            pathId={generatePathId(stage - 1, idx)}
        />
        )
      })}
    </Flex>
    <Flex direction='column' border='1px solid white' borderRadius='10px' p='15px' gap='10px' fontSize='12px'>
      <Text fontWeight='700' fontSize='14px'>Path {selectedPath} Lore</Text>
      <Text>{stageMetadata.paths[selectedPath - 1].lore}</Text>
    </Flex>
    <Button variant='orangeGradient' w='100%' fontWeight='700' fontSize='16' onClick={() => handleClick.mutate()}>Vote</Button>
  </Flex>
  )
}

export default VotingStagePanel
