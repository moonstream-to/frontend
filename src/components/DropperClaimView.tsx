/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react"
import { useQuery, useMutation } from "react-query"
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Button,
	Editable,
	EditablePreview,
	EditableTextarea,
	IconButton,
	Input,
	useToast,
} from "@chakra-ui/react"
import { Box, Flex, Spacer, Text } from "@chakra-ui/layout"
import { Image } from "@chakra-ui/image"

import PoolDetailsRow from "./PoolDetailsRow"
import Spinner from "./Spinner/Spinner"
import Web3Context from "../contexts/Web3Context/context"
import queryCacheProps from "../hooks/hookCommon"
import { MULTICALL2_CONTRACT_ADDRESSES, PORTAL_PATH } from "../constants"
import { LinkIcon } from "@chakra-ui/icons"
const dropperAbi = require("../web3/abi/Dropper.json")
import { Dropper } from "../web3/contracts/types/Dropper"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from "remark-gfm"
import { queryHttp } from "../utils/http"
import useDrops from "../hooks/useDrops"
import useDrop from "../hooks/useDrop"

const DropperClaimView = ({
	address,
	claimId,
	metadata,
}: {
	address: string
	claimId: string
	metadata: any
}) => {
	const { chainId, web3, account } = useContext(Web3Context)

	const headerMeta = ["name", "description", "image", "attributes"]
	const [newUri, setNewUri] = useState("")
	const web3ctx = useContext(Web3Context)

	// const terminusFacet = new web3.eth.Contract(terminusAbi) as any as MockTerminus
	// terminusFacet.options.address = address
	const toast = useToast()
	const commonProps = {
		onSuccess: () => {
			toast({
				title: "Successfully updated contract",
				status: "success",
				duration: 5000,
				isClosable: true,
			})
			// contractState.refetch(); //TODO
		},
		onError: () => {
			toast({
				title: "Something went wrong",
				status: "error",
				duration: 5000,
				isClosable: true,
			})
		},
	}

	// const setPoolURI = useMutation(
	// 	({ uri, poolId }: { uri: string; poolId: string }) =>
	// 		terminusFacet.methods.setURI(poolId, uri).send({ from: account }),
	// 	{ ...commonProps },
	// )

	// const handleNewUri = () => {
	// 	setPoolURI.mutate(
	// 		{ uri: newUri, poolId: poolId },
	// 		{
	// 			onSettled: () => {
	// 				poolState.refetch()
	// 			},
	// 		},
	// 	)
	// }

	// useEffect(() => {
	// 	console.log(address, metadata, claimId)
	// }, [claimId])

	const claim = useQuery(
		[`/play/drops/${"550dbfe5-e3e0-4094-8255-5ba08e40744c"}`],
		(query: any) => queryHttp(query).then((r: any) => r.data),
		{
			...queryCacheProps,
			enabled: !!claimId,
		},
	)

	const { adminClaims, pageOptions, dropperContracts } = useDrops({
		dropperAddress: address,
		ctx: web3ctx,
	})

	// const useDrop = ({
	//   ctx,
	//   claimId,
	//   getAll,
	// }: {

	// const { claimants } = useDrop({ ctx: web3ctx, claimId, getAll: false })

	const [dbData, setDbData] = useState<
		| {
				deadline: string
				id: string
				terminusAddress: string
				terminusPoolId: string
		  }
		| undefined
	>(undefined)

	useEffect(() => {
		console.log(adminClaims.data)
		console.log(dropperContracts.data)
		if (adminClaims.data) {
			const claimDbData = adminClaims.data.find(
				(claim: { drop_number: number }) => claim.drop_number === Number(claimId),
			)
			if (claimDbData) {
				const {
					id,
					claim_block_deadline: deadline,
					terminus_address: terminusAddress,
					terminus_pool_id: terminusPoolId,
				} = claimDbData
				setDbData({
					id,
					terminusAddress, //: `${PORTAL_PATH}/terminus/?contractAddress=${terminusAddress}`,
					terminusPoolId, //: `${PORTAL_PATH}/terminus/?contractAddress=${terminusAddress}&poolId=${terminusPoolId}`,
					deadline,
				})
			}
		}
	}, [adminClaims.data, dropperContracts.data, claimId])
	// Антон, для дев серва вот этот ENGINE_DROPPER_ADDRESS="0x6339129961dc2EaCC3C81Bc84BD4AB196F5CBa0d" как NEXT_PUBLIC_DROPPER_ADDRESS

	useEffect(() => {
		console.log(claim.data)
	}, [claim.data])

	useEffect(() => {
		console.log(dbData)
	}, [dbData])

	// const DROP_TYPES = new Map({
	// 	"20": "ERC20",
	// 	"712": "ERC721",
	// 	"1155": "ERC1155",
	// 	"1": "Mint Terminus",
	// })

	const dropTypes = new Map<string, string>([
		["20", "ERC20"],
		["721", "ERC721"],
		["1155", "ERC1155"],
		["1", "Mint Terminus"],
	])

	const claimState = useQuery(
		["claimState", address, claimId, chainId],
		async () => {
			// console.log("claimState")
			const MULTICALL2_CONTRACT_ADDRESS =
				MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES]
			if (!address || !MULTICALL2_CONTRACT_ADDRESS) {
				return
			}
			const dropperContract = new web3.eth.Contract(dropperAbi) as any as Dropper
			dropperContract.options.address = address ?? ""
			// const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS)
			// const target = address
			// const callDatas = []
			const claim = await dropperContract.methods.getClaim(claimId).call()
			// const status = await dropperContract.methods.getClaimStatus(claimId, web3ctx.account).call()
			const claimUri = await dropperContract.methods.claimUri(claimId).call()
			const signer = await dropperContract.methods.getSignerForClaim(claimId).call()
			// console.log(claim, claimUri, signer, claim[3], typeof claim[3])
			const dropType = dropTypes.get(claim[3]) ?? "undefined"
			return { claim, claimUri, signer, dropType }
			// callDatas.push(dropperContract.methods.getClaim(claimId).encodeABI())
			// callDatas.push(dropperContract.methods.getClaimStatus(claimId, web3ctx.account).encodeABI())
			// callDatas.push(dropperContract.methods.claimUri(claimId).encodeABI())
			// callDatas.push(dropperContract.methods.getSignerForClaim(claimId).encodeABI())

			// const queries = callDatas.map((callData) => {
			// 	return {
			// 		target,
			// 		callData,
			// 	}
			// })
			// return (
			// 	multicallContract.methods
			// 		.tryAggregate(false, queries)
			// 		.call()
			// 		.then((results: string[][]) => {
			// 			console.log(results)
			// 			const parsedResults = results.map((result: string[], idx: number) => {
			// 				try {
			// 					console.log(web3.utils.hexToBytes(result[1]))
			// 					return web3.utils.hexToUtf8(result[1])
			// 				} catch {
			// 					return -1
			// 				}
			// 			})
			// 			console.log(parsedResults)
			// 			return parsedResults
			// 		})
			// 		// 	const data = {
			// 		// 		controller: parsedResults[0],
			// 		// 		isBurnable: parsedResults[1],
			// 		// 		isTransferable: parsedResults[2],
			// 		// 		capacity: parsedResults[3],
			// 		// 		supply: parsedResults[4],
			// 		// 		uri: parsedResults[5],
			// 		// 	}
			// 		// 	return data
			// 		// })
			// 		.catch((e: any) => {
			// 			console.log(e)
			// 		})
			// )
		},
		{
			...queryCacheProps,
			enabled: Number(claimId) > 0,
			// onSuccess: () => {}, //TODO
		},
	)

	const copyClaimAddress = () => {
		navigator.clipboard
			.writeText(
				`https://portal.moonstream.to/dropper/?contractAddress=${address}&claimId=${claimId}`,
			)
			.then(() => {
				toast({
					duration: 3000,
					render: () => (
						<Box borderRadius="10px" textAlign="center" color="black" p={3} bg="green.800">
							Copied to clipboard
						</Box>
					),
				})
			})
			.catch((e) => {
				toast({
					duration: 3000,
					render: () => (
						<Box borderRadius="10px" textAlign="center" color="black" p={3} bg="red.800">
							{e}
						</Box>
					),
				})
			})
	}

	if (Number(claimId) < 0) {
		return <></>
	}

	return (
		<Flex
			id="poolView"
			bg="#2d2d2d"
			minW="800px"
			borderRadius="20px"
			p="30px"
			color="white"
			direction="column"
			maxW="800px"
		>
			<Flex gap={2}>
				<Text
					textAlign="start"
					color="#c2c2c2"
					w="fit-content"
					py={1}
					pr={0}
					borderBottom="1px solid #c2c2c2"
					fontSize="20px"
					mb="20px"
				>
					{`claim ${claimId}`}
				</Text>
				<IconButton
					bg="transparent"
					onClick={copyClaimAddress}
					color="#c2c2c2"
					_hover={{ bg: "transparent", color: "white" }}
					icon={<LinkIcon />}
					aria-label="copy link"
				/>
			</Flex>
			{!!claimState.data && (
				<>
					{metadata?.name && (
						<Text fontWeight="700" fontSize="24px" mb="20px">
							{metadata.name}
						</Text>
					)}
					<Flex direction="column" gap="20px" overflowY="auto">
						<Flex gap="20px">
							{metadata?.image && (
								<Image w="140px" h="140px" borderRadius="20px" src={metadata.image} alt="image" />
							)}
							{metadata?.description && (
								<ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
									{metadata.description}
								</ReactMarkdown>
							)}
						</Flex>

						{claimState.data?.claim && (
							<Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
								<PoolDetailsRow type="Token address" value={claimState.data.claim.tokenAddress} />
								<PoolDetailsRow type="Drop type" value={claimState.data.dropType} />

								<PoolDetailsRow type="Signer" value={claimState.data.signer} />
								{metadata && (
									<Accordion allowMultiple>
										<AccordionItem border="none">
											<AccordionButton p="0" mb="10px">
												<Spacer />
												<Box as="span" flex="1" textAlign="right" pr="10px" fontWeight="700">
													Metadata
												</Box>
												<AccordionIcon />
											</AccordionButton>
											<AccordionPanel>
												<PoolDetailsRow
													type="uri"
													href={claimState.data.claimUri}
													value={claimState.data.claimUri}
												/>

												{Object.keys(metadata)
													.filter((key) => !headerMeta.includes(key))
													.map((key) => {
														return (
															<PoolDetailsRow key={key} type={key} value={String(metadata[key])} />
														)
													})}
												{metadata?.attributes && (
													<>
														<Text fontWeight="700" mt="20px">
															Attributes:
														</Text>

														{metadata.attributes.map(
															(attribute: { trait_type: string; value: string }) => (
																<PoolDetailsRow
																	key={attribute.trait_type}
																	type={attribute.trait_type}
																	value={String(attribute.value)}
																	ml="20px"
																/>
															),
														)}
													</>
												)}
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
								)}
								{dbData && (
									<>
										<PoolDetailsRow type="Deadline" value={String(dbData.deadline)} />
										<PoolDetailsRow
											href={`${PORTAL_PATH}/terminus/?contractAddress=${dbData.terminusAddress}&poolId=${dbData.terminusPoolId}`}
											type="Terminus address"
											value={String(dbData.terminusAddress)}
										/>

										<PoolDetailsRow
											href={`${PORTAL_PATH}/terminus/?contractAddress=${dbData.terminusAddress}&poolId=${dbData.terminusPoolId}`}
											type="Terminus Pool"
											value={String(dbData.terminusPoolId)}
										/>
										{/* </Link> */}
									</>
								)}
							</Flex>
						)}
					</Flex>
					{/* {claimState.data && claimState.data.owner === account && (
						<Flex gap="15px" mt="20px">
							<Input
								placeholder="new uri"
								value={newUri}
								onChange={(e) => setNewUri(e.target.value)}
								type="url"
							/>
							<Button
								bg="gray.0"
								fontWeight="400"
								fontSize="18px"
								color="#2d2d2d"
								onClick={handleNewUri}
							>
								Save
							</Button>
						</Flex>
					)} */}
				</>
			)}
			{!claimState.data && (
				<Flex alignItems="center" justifyContent="center" h="100%">
					<Spinner h="50px" w="50px" />
				</Flex>
			)}
		</Flex>
	)
}

export default DropperClaimView
