/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext } from "react"
import { useQuery } from "react-query"
import { Flex } from "@chakra-ui/react"

import Spinner from "./Spinner/Spinner"
import Web3Context from "../contexts/Web3Context/context"
import TerminusPoolsListItem from "./TerminusPoolsListItem"
import queryCacheProps from "../hooks/hookCommon"
const terminusAbi = require("../web3/abi/MockTerminus.json")
const multicallABI = require("../web3/abi/Multicall2.json")
import { MockTerminus } from "../web3/contracts/types/MockTerminus"
import { MAX_INT, MULTICALL2_CONTRACT_ADDRESSES } from "../constants"
const dropperAbi = require("../web3/abi/Dropper.json")
import { Dropper } from "../web3/contracts/types/Dropper"
import DropperClaimsListItem from "./DropperClaimsListItem"

const DropperClaimsList = ({
	contractAddress,
	selected,
	onChange,
	filter,
	queryClaimId,
}: {
	contractAddress: string
	selected: number
	onChange: (id: string, metadata: unknown) => void
	filter: string
	queryClaimId: number | undefined
}) => {
	const { chainId, web3 } = useContext(Web3Context)

	const claimsList = useQuery(
		["claimsList", contractAddress, chainId, queryClaimId],
		async () => {
			const MULTICALL2_CONTRACT_ADDRESS =
				MULTICALL2_CONTRACT_ADDRESSES[String(chainId) as keyof typeof MULTICALL2_CONTRACT_ADDRESSES]
			if (!contractAddress || !MULTICALL2_CONTRACT_ADDRESS) {
				return
			}
			const dropperContract = new web3.eth.Contract(dropperAbi) as any as Dropper
			dropperContract.options.address = contractAddress ?? ""

			const multicallContract = new web3.eth.Contract(multicallABI, MULTICALL2_CONTRACT_ADDRESS)

			const uriQueries = []

			const LIMIT = Number(MAX_INT)
			let totalClaims
			try {
				totalClaims = await dropperContract.methods.numClaims().call()
			} catch (e) {
				console.log(e)
				totalClaims = 0
			}
			for (let i = 1; i <= Math.min(LIMIT, Number(totalClaims)); i += 1) {
				uriQueries.push({
					target: contractAddress,
					callData: dropperContract.methods.claimUri(i).encodeABI(),
				})
			}

			return multicallContract.methods
				.tryAggregate(false, uriQueries)
				.call()
				.then((results: string[]) => {
					return results.map((result) => {
						let parsed
						try {
							parsed = web3.utils.hexToUtf8(result[1]).split("https://")[1]
							if (!parsed) {
								throw "not an address"
							}
							parsed = "https://" + parsed
						} catch (e) {
							console.log(e)
							parsed = undefined
						}
						return parsed
					})
				})
				.then((parsedResults: string[]) => {
					return parsedResults
				})
		},
		{
			...queryCacheProps,
			// onSuccess: () => {}, //TODO
		},
	)

	if (!claimsList.data) {
		return <Spinner />
	}

	return (
		<Flex direction="column" gap="15px" h="100%" overflowY="auto">
			{claimsList.data.map((uri: string, idx: number) => (
				<DropperClaimsListItem
					key={idx}
					address={contractAddress}
					claimId={String(idx + 1)}
					selected={idx + 1 === selected}
					inQuery={idx + 1 === queryClaimId}
					uri={uri}
					onChange={onChange}
					filter={filter}
				/>
			))}
		</Flex>
	)
}

export default DropperClaimsList
