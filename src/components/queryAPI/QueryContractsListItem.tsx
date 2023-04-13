import { Flex, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useQueryAPI from "../../contexts/QueryAPIContext"
import ChainTag from "../ChainTag"
import Tag from "../Tag"

const QueryContractsListItem = ({ contract, types }: { contract: any; types: any }) => {
  const [type, setType] = useState<{ icon_url?: string }>({})
  const { selectedContract, setSelectedContract } = useQueryAPI()

  useEffect(() => {
    // console.log(types, contract)
    if (contract && types) {
      // console.log(contract)
      setType(types.find(({ id }: { id: string }) => id === contract.subscription_type_id) ?? {})
    }
  }, [contract, types])

  return (
    <Flex flexDirection="column" gap="15px" p="10px" onClick={() => setSelectedContract(contract)}>
      <Flex gap="10px" alignItems="center">
        {type && type.icon_url && <Image h="20px" w="20px" alt="" src={type.icon_url} />}
        <Text fontSize="18px">{contract.label}</Text>
      </Flex>
      <Flex gap="5px">
        <ChainTag name={contract.subscription_type_id.split("_")[0]} />
        <Tag name={contract.subscription_type_id.split("_").slice(1).join("")} />
      </Flex>
    </Flex>
  )
}

export default QueryContractsListItem
