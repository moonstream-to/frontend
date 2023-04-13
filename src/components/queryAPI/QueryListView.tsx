import { Button, Flex } from "@chakra-ui/react"
import useQueryAPI from "../../contexts/QueryAPIContext"

const QueryListView = () => {
  const { isShowContracts, setIsShowContracts } = useQueryAPI()
  return (
    <Flex w="400px" borderRadius="20px" p="30px" bg="#2d2d2d" gap="30px" flexDirection="column">
      <Flex gap="20px" justifyContent="start" fontSize="24px" lineHeight="24px" p="0">
        <Button
          disabled={!isShowContracts}
          onClick={() => setIsShowContracts(false)}
          variant="selector"
        >
          Queries
        </Button>
        <Button
          variant="selector"
          disabled={isShowContracts}
          onClick={() => setIsShowContracts(true)}
        >
          Contracts
        </Button>
      </Flex>
    </Flex>
  )
}

export default QueryListView
