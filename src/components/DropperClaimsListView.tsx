/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react"
import { useMutation } from "react-query"
import {
	Button,
	Checkbox,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react"

import TerminusPoolsList from "./TerminusPoolsList"
import Web3Context from "../contexts/Web3Context/context"
const terminusAbi = require("../web3/abi/MockTerminus.json")
import { MockTerminus } from "../web3/contracts/types/MockTerminus"
import { useRouter } from "next/router"
import { MAX_INT } from "../constants"
import DropperClaimsList from "./DropperClaimsList"

const DropperClaimsListView = ({
	contractAddress,
	selected,
	onChange,
	contractState,
}: {
	contractAddress: string
	selected: number
	onChange: (id: string, metadata: unknown) => void
	contractState: any
}) => {
	const toast = useToast()
	const router = useRouter()

	const [queryClaimId, setQueryClaimId] = useState<number | undefined>(undefined)
	const [filter, setFilter] = useState("")
	const { isOpen, onOpen, onClose } = useDisclosure()
	const web3ctx = useContext(Web3Context)
	const [newClaimProps, setNewClaimProps] = useState<{
		capacity: string | undefined
		isTransferable: boolean
		isBurnable: boolean
	}>({ capacity: undefined, isTransferable: true, isBurnable: true })

	useEffect(() => {
		setQueryClaimId(
			typeof router.query.claimlId === "string" ? Number(router.query.claimId) : undefined,
		)
	}, [router.query])

	// const terminusFacet = new web3ctx.web3.eth.Contract(terminusAbi) as any as MockTerminus
	// terminusFacet.options.address = contractAddress

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

	// const newPool = useMutation(
	// 	({
	// 		capacity,
	// 		isBurnable,
	// 		isTransferable,
	// 	}: {
	// 		capacity: string
	// 		isBurnable: boolean
	// 		isTransferable: boolean
	// 	}) =>
	// 		terminusFacet.methods
	// 			.createPoolV1(capacity, isTransferable, isBurnable)
	// 			.send({ from: web3ctx.account }),
	// 	{ ...commonProps },
	// )

	// const createNewPool = () => {
	// 	const capacity = Number(newPoolProps.capacity)

	// 	if (
	// 		!newPoolProps.capacity ||
	// 		!Number(capacity) ||
	// 		!Number.isInteger(capacity) ||
	// 		capacity < 1
	// 	) {
	// 		onOpen()
	// 		toast({
	// 			title: "Capacity must be a positive number",
	// 			status: "error",
	// 			duration: 3000,
	// 			isClosable: true,
	// 		})
	// 		return
	// 	}
	// 	newPool.mutate(
	// 		{
	// 			capacity: newPoolProps.capacity,
	// 			isTransferable: newPoolProps.isTransferable,
	// 			isBurnable: newPoolProps.isBurnable,
	// 		},
	// 		{
	// 			// onSettled: () => {}, TODO
	// 		},
	// 	)
	// }

	return (
		<Flex
			direction="column"
			bg="#2d2d2d"
			borderRadius="20px"
			gap="30px"
			p="30px"
			w="400px"
			maxH="700px"
			color="white"
		>
			<Text fontWeight="700" fontSize="24px">
				claims
			</Text>
			<Input
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				placeholder="search"
				borderRadius="10px"
				p="8px 15px"
			/>

			<DropperClaimsList
				contractAddress={contractAddress}
				onChange={onChange}
				selected={selected}
				filter={filter}
				queryClaimId={queryClaimId ?? undefined}
			/>

			{contractState && contractState.owner === web3ctx.account && (
				<Button
					width="100%"
					bg="gray.0"
					fontWeight="700"
					fontSize="20px"
					color="#2d2d2d"
					onClick={onOpen}
				>
					+ Add new
				</Button>
			)}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg="#181818" color="white" border="1px solid white">
					<ModalHeader>New pool</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex gap={3}>
							<Input
								onChange={(e) =>
									setNewClaimProps((prev) => {
										return { ...prev, capacity: e.target.value }
									})
								}
								placeholder="capacity"
								type="number"
								value={newClaimProps.capacity}
								mb={4}
							/>
							<Button
								colorScheme="purple"
								onClick={() => {
									setNewClaimProps((prev) => {
										return { ...prev, capacity: MAX_INT }
									})
								}}
							>
								MAX_INT
							</Button>
						</Flex>
						<Checkbox
							colorScheme="white"
							mr={3}
							onChange={(e) =>
								setNewClaimProps((prev) => {
									return { ...prev, isBurnable: e.target.checked }
								})
							}
							isChecked={newClaimProps.isBurnable}
						>
							Burnable
						</Checkbox>
						<Checkbox
							colorScheme="white"
							onChange={(e) =>
								setNewClaimProps((prevState) => {
									return { ...prevState, isTransferable: e.target.checked }
								})
							}
							isChecked={newClaimProps.isTransferable}
						>
							Transferable
						</Checkbox>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="whiteAlpha" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button
							colorScheme="teal"
							onClick={() => {
								// createNewPool()
								onClose()
							}}
						>
							Create
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	)
}

export default DropperClaimsListView
