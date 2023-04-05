import React from "react"
import { Flex } from "@chakra-ui/react"
import { NFTInfo } from "./types"
import NFTCard from "./NFTCard"

const _NFTList = ({ nftList }: { nftList: NFTInfo[] }) => (
  <Flex wrap="wrap" justifyContent="left" gap="20px" mt="20px">
    {nftList.map((item: NFTInfo, idx: number) => {
      return (
        <NFTCard
          maxW={["140px", "170px", "220px"]}
          key={idx}
          imageUrl={item.imageURI}
          name={item.metadata ? item.metadata.name : ""}
          description={item.metadata ? item.metadata.description : ""}
          balance={1}
          showQuantity={false}
        />
      )
    })}
  </Flex>
)

export default _NFTList
