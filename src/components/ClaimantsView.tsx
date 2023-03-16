/* eslint-disable react/no-children-prop */
import { SearchIcon, SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons"
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Collapse,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Spacer,
	Spinner,
	Text,
	useDisclosure,
	Icon,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { AiOutlineSave } from "react-icons/ai"
import { useMutation, useQueryClient } from "react-query"
import Web3Context from "../contexts/Web3Context/context"
import useDrop from "../hooks/useDrop"
import useMoonToast from "../hooks/useMoonToast"
import useSearch from "../hooks/useSearch"
import http from "../utils/http"

const ClaimantsView = ({ claimId }: { claimId: string }) => {
	const [searchString, setSearchString] = useState("")
	const [searchAddress, setSearchAddress] = useState("")

	const toast = useMoonToast()
	const web3ctx = useContext(Web3Context)
	const { claimants } = useDrop({
		ctx: web3ctx,
		claimId: claimId,
	})

	const { search } = useSearch({
		pathname: `/admin/drops/${claimId}/claimants/search`,
		query: { address: searchAddress },
	})

	const { onOpen, onClose, isOpen } = useDisclosure()
	const [addingClaimant, setAddingClaimant] = useState(false)
	const [newAddress, setNewAddress] = useState("")
	const [newAmount, setNewAmount] = useState("")
	const queryClient = useQueryClient()

	const handleSearchClick = () => {
		if (web3ctx.web3.utils.isAddress(searchString)) {
			setSearchAddress(searchString)
			onOpen()
		} else {
			toast("invalid address", "error")
		}
	}

	const onDoneAdding = () => {
		setNewAddress("")
		setNewAmount("")
		setAddingClaimant(false)
	}

	const addClaimants = useMutation(
		({ claimants }: { claimants: { address: string; amount: number }[] }) => {
			const data = { dropper_claim_id: claimId, claimants: claimants }
			const API = "https://engineapi.moonstream.to" //TODO
			const ADMIN_API = `${API}`
			return http({
				method: "POST",
				url: `${ADMIN_API}/drops/claimants`,
				data: data,
			})
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries("claimants")
				toast("Claimant updated", "success")
				onDoneAdding()
			},
			onError: () => {
				toast("Updating drop failed >.<", "error")
			},
		},
	)

	return (
		<Accordion allowToggle borderRadius="10px" bg="#232323" border="1px solid #4d4d4d" p="20px">
			<AccordionItem border="none">
				<AccordionButton p="0px">
					<Text>Claimlist</Text>
					<Spacer />
					<AccordionIcon />
				</AccordionButton>
				<AccordionPanel p="0px">
					{claimants.data && (
						<Flex direction="column" gap="20px">
							<Flex justifyContent="space-between" alignItems="center" mt="20px">
								<InputGroup w="480px">
									<Input
										value={searchString}
										onChange={(e) => setSearchString(e.target.value)}
										placeholder="search for address"
										borderRadius="10px"
										p="8px 15px"
									/>
									<InputRightElement
										children={
											<IconButton
												_hover={{ color: "#ffccd4" }}
												bg="transparent"
												aria-label="search"
												icon={<SearchIcon />}
												onClick={() => handleSearchClick()}
											/>
										}
									/>
								</InputGroup>
								<Flex
									alignItems="center"
									gap="10px"
									cursor="pointer"
									onClick={() => setAddingClaimant(true)}
								>
									<Text>Add claimant</Text>
									<SmallAddIcon />
								</Flex>
							</Flex>

							<Collapse in={isOpen} animateOpacity>
								{search.isLoading && <Spinner />}
								{!search.isLoading && (
									<Flex justifyContent="space-between" alignItems="center">
										{!search.isLoading && search.data?.address && (
											<Text>Amount: {search.data?.raw_amount ?? "undefined"}</Text>
										)}
										{!search.isLoading && !search.data?.address && <Text>Not found</Text>}
										<IconButton
											bg="transparent"
											aria-label="close"
											icon={<SmallCloseIcon />}
											onClick={onClose}
											_hover={{ bg: "#3f3f3f" }}
										/>
									</Flex>
								)}
							</Collapse>
							<Flex gap="40px" fontSize="16px">
								<Flex direction="column">
									<Text py="10px" borderBottom="0.5px solid #8b8b8b" fontWeight="700">
										Address
									</Text>
									{addingClaimant && (
										<InputGroup mt="10px" fontFamily="Jet Brains Mono, monospace">
											<Input
												variant="address"
												fontSize="16px"
												w="45ch"
												value={newAddress}
												onChange={(e) => setNewAddress(e.target.value)}
											/>
										</InputGroup>
									)}
									{claimants.data.map((claimant: { address: string }, idx: number) => (
										<Text
											py="12px"
											key={idx}
											fontFamily="Jet Brains Mono, monospace"
											fontSize="16px"
										>
											{claimant.address}
										</Text>
									))}
								</Flex>
								<Flex direction="column">
									<Text py="10px" borderBottom="0.5px solid #8b8b8b" fontWeight="700">
										Amount
									</Text>
									{addingClaimant && (
										<Flex alignItems="center" mt="10px" gap="10px">
											<Input
												variant="address"
												fontSize="16px"
												w="5ch"
												value={newAmount}
												onChange={(e) => setNewAmount(e.target.value)}
											/>
											{!addClaimants.isLoading ? (
												<IconButton
													bg="transparent"
													aria-label="cancel"
													icon={<Icon as={AiOutlineSave} />}
													_hover={{ bg: "#3f3f3f" }}
													onClick={() =>
														addClaimants.mutate({
															claimants: [{ address: newAddress, amount: Number(newAmount) }],
														})
													}
												/>
											) : (
												<Spinner />
											)}
											<IconButton
												bg="transparent"
												aria-label="cancel"
												icon={<SmallCloseIcon />}
												onClick={() => onDoneAdding()}
												_hover={{ bg: "#3f3f3f" }}
											/>
										</Flex>
									)}
									{claimants.data.map((claimant: { amount: string }, idx: number) => (
										<Text py="12px" key={idx}>
											{claimant.amount}
										</Text>
									))}
								</Flex>
							</Flex>
						</Flex>
					)}
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	)
}

export default ClaimantsView
