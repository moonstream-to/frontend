import { useEffect, useState } from "react"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { Image } from "@chakra-ui/react"

import useLink from "../hooks/useLink"

const TerminusPoolsListItem = ({
  poolId,
  selected,
  onChange,
  uri,
  filter,
  inQuery,
}: {
  poolId: string
  address: string
  selected: boolean
  onChange: (id: string, metadata: unknown) => void
  uri: string
  filter: string
  inQuery: boolean
}) => {
  const metadata = useLink({ link: uri })

  const handleClick = () => {
    onChange(poolId, metadata.data)
  }

  useEffect(() => {
    if (selected) {
      onChange(poolId, metadata.data)
    }
  }, [selected, metadata, poolId, onChange])

  useEffect(() => {
    if (inQuery) {
      const element = document.getElementById(`pool-${poolId}`)
      element?.scrollIntoView({ block: "center" })
      const poolView = document.getElementById("poolView")
      poolView?.scrollIntoView()
    }
  }, [inQuery, poolId])

  const [show, setShow] = useState(true)
  useEffect(() => {
    if (filter === "") {
      setShow(true)
      return
    }
    const lowCaseFilter = filter.toLowerCase()
    if (metadata.data?.name?.toLowerCase().includes(lowCaseFilter)) {
      setShow(true)
      return
    }
    if (metadata.data?.description?.toLowerCase().includes(lowCaseFilter)) {
      setShow(true)
      return
    }
    if (poolId.toString().startsWith(lowCaseFilter)) {
      setShow(true)
      return
    }
    setShow(false)
  }, [filter, metadata.data, poolId])

  return (
    <>
      {show && (
        <Flex
          gap="15px"
          alignItems="center"
          bg={selected ? "#4d4d4d" : "transparent"}
          fontWeight={selected ? "900" : "400"}
          borderRadius="10px"
          onClick={handleClick}
          cursor="pointer"
          p="10px"
          id={`pool-${String(poolId)}`}
        >
          {!metadata.data?.image && (
            <>
              <Box border="1px solid black" borderRadius="5px" w="32px" h="32px" />
            </>
          )}
          {metadata.data && (
            <>
              {metadata.data.image && (
                <Image
                  src={metadata.data.image}
                  width="32px"
                  height="32px"
                  alt={metadata.data.image}
                  borderRadius="5px"
                />
              )}
              <Text unselectable="on">{metadata.data.name}</Text>
            </>
          )}
          {!metadata.data?.name && (
            <>
              <Text borderRadius="5px" h="32px" flexGrow="1" textStyle="italic" color="gray">
                no name
              </Text>
            </>
          )}
        </Flex>
      )}
    </>
  )
}

export default TerminusPoolsListItem
