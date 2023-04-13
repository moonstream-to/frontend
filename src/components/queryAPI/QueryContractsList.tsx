import { Flex } from "@chakra-ui/react"
import { useQuery } from "react-query"
import queryCacheProps from "../../hooks/hookCommon"
import useMoonToast from "../../hooks/useMoonToast"
import { SubscriptionsService } from "../../services"
import QueryContractsListItem from "./QueryContractsListItem"

function compare(a: { created_at: string }, b: { created_at: string }) {
  if (a.created_at > b.created_at) {
    return -1
  }
  if (a.created_at < b.created_at) {
    return 1
  }
  return 0
}

const QueryContractsList = () => {
  const toast = useMoonToast()
  const getSubscriptions = async () => {
    const response = await SubscriptionsService.getSubscriptions()
    const types = await SubscriptionsService.getTypes()
    return response.data
  }

  const subscriptions = useQuery(["subscriptions"], getSubscriptions, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error, "error")
    },
  })

  const getTypes = async () => {
    const response = await SubscriptionsService.getTypes()
    return response.data
  }

  const types = useQuery(["subscription_types"], getTypes, {
    ...queryCacheProps,
  })

  return (
    <>
      {subscriptions.data && (
        <Flex flexDirection="column" overflowY="auto">
          {subscriptions.data.subscriptions
            .sort(compare)
            .slice(5, 55)
            .map((contract: any) => (
              <QueryContractsListItem
                key={contract.id}
                contract={contract}
                types={types.data?.subscription_types ?? undefined}
              />
            ))}
        </Flex>
      )}
    </>
  )
}
export default QueryContractsList
