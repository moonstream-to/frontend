/* eslint-disable @typescript-eslint/no-var-requires */
import Head from "next/head"
import { useRouter } from "next/router"

import { useContext, useEffect, useState } from "react"
import { Box, Button, Center, Flex, Input, useToast } from "@chakra-ui/react"

import Layout from "../../src/components/layout"
import DropperContractView from "../../src/components/DropperContractView"
import Web3Context from "../../src/contexts/Web3Context/context"
import useDropperContract from "../../src/hooks/useDropper.sol"
import DropperClaimsListView from "../../src/components/DropperClaimsListView"
import DropperClaimView from "../../src/components/DropperClaimView"

const Dropper = () => {
	const router = useRouter()
	const contractAddress =
		typeof router.query.contractAddress === "string" ? router.query.contractAddress : ""

	const web3ctx = useContext(Web3Context)

	const { contractState } = useDropperContract({ dropperAddress: contractAddress, ctx: web3ctx })

	const handleClick = (claimId: string, metadata: unknown) => {
		setSelected(Number(claimId))
		setClaimMetadata(metadata)
	}
	const [selected, setSelected] = useState(1)
	const [claimMetadata, setClaimMetadata] = useState<unknown>({})
	const [nextValue, setNextValue] = useState(contractAddress)

	const toast = useToast()

	useEffect(() => {
		if (!router.query.claimId) {
			setSelected(1)
		} else {
			setSelected(Number(router.query.claimId))
		}
	}, [router.query.claimId])

	useEffect(() => {
		if (contractAddress) {
			setNextValue(contractAddress)
		}
		setClaimMetadata({})
	}, [contractAddress])

	const { chainId, web3 } = useContext(Web3Context)

	useEffect(() => {
		if (nextValue && web3.utils.isAddress(nextValue)) {
			handleSubmit()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId])

	const handleSubmit = () => {
		if (web3.utils.isAddress(nextValue)) {
			setClaimMetadata({})
			router.push({
				pathname: "/dropper",
				query: {
					contractAddress: nextValue,
					claimId: router.query.claimId,
				},
			})
		} else {
			toast({
				render: () => (
					<Box borderRadius="5px" textAlign="center" color="black" p={1} bg="red.600">
						Invalid address
					</Box>
				),
				isClosable: true,
			})
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.code === "Enter") {
			handleSubmit()
		}
	}

	return (
		<Layout home={true}>
			<Head>
				<title>Moonstream portal - Dropper</title>
			</Head>
			<Center>
				<Flex gap="30px" direction="column" px="7%" py="30px" color="white">
					<Flex gap="20px">
						<Input
							onKeyDown={handleKeyDown}
							w="50ch"
							placeholder="dropper contract address"
							type="text"
							value={nextValue}
							onChange={(e) => setNextValue(e.target.value)}
						/>
						<Button
							bg="gray.0"
							fontWeight="400"
							fontSize="18px"
							color="#2d2d2d"
							onClick={handleSubmit}
						>
							Show
						</Button>
					</Flex>
					{contractAddress && (
						<>
							<DropperContractView address={contractAddress} />
							<Flex gap="40px" maxH="700px">
								<DropperClaimsListView
									contractAddress={contractAddress}
									contractState={contractState}
									onChange={handleClick}
									selected={selected}
								/>
								<DropperClaimView
									address={contractAddress}
									claimId={String(selected)}
									metadata={claimMetadata}
								/>
							</Flex>
						</>
					)}
				</Flex>
			</Center>
		</Layout>
	)
}

export default Dropper
