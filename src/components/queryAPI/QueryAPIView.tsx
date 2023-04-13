import { Center, Flex } from "@chakra-ui/react"
import QueryContractView from "./QueryContractView"
import QueryListView from "./QueryListView"

const QueryAPIView = () => {
  return (
    <Center>
      <Flex gap="30px" py="30px" px="7%" maxH="700px" minH="700px" maxW="1600px" minW="1600px">
        <QueryListView />
        <QueryContractView />
      </Flex>
    </Center>
  )
}

export default QueryAPIView
