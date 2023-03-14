import { useEffect, useState } from "react"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { Image } from "@chakra-ui/react"

import useLink from "../hooks/useLink"

const DropperClaimsListItem = ({
	claimId,
	selected,
	onChange,
	uri,
	filter,
	inQuery,
	dbData,
}: {
	claimId: string
	address: string
	selected: boolean
	onChange: (id: string, metadata: unknown) => void
	uri: string
	filter: string
	inQuery: boolean
	dbData: any
}) => {
	const metadata = useLink({ link: uri })

	const handleClick = () => {
		onChange(claimId, metadata.data)
	}

	useEffect(() => {
		if (selected) {
			onChange(claimId, metadata.data)
		}
	}, [selected, metadata, claimId, onChange])

	useEffect(() => {
		if (inQuery) {
			const element = document.getElementById(`claim-${claimId}`)
			element?.scrollIntoView({ block: "center" })
			const poolView = document.getElementById("poolView")
			poolView?.scrollIntoView()
		}
	}, [inQuery, claimId])

	const [show, setShow] = useState(true)
	useEffect(() => {
		if (filter === "") {
			setShow(true)
			return
		}
		const lFilter = filter.toLowerCase()
		if (metadata.data?.name?.toLowerCase().includes(lFilter)) {
			setShow(true)
			return
		}
		if (metadata.data?.description?.toLowerCase().includes(lFilter)) {
			setShow(true)
			return
		}
		if (claimId.toString().startsWith(lFilter)) {
			setShow(true)
			return
		}
		setShow(false)
	}, [filter, metadata.data, claimId])

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
					id={`pool-${String(claimId)}`}
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
					{dbData && <Text>{dbData.active ? "active" : "inactive"}</Text>}
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

export default DropperClaimsListItem
