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
	Select,
} from "@chakra-ui/react"
import { useContext, useEffect, useState } from "react"
import {
	AiOutlineArrowLeft,
	AiOutlineArrowRight,
	AiOutlineSave,
	AiOutlineVerticalRight,
} from "react-icons/ai"
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
	const { claimants, setClaimantsPage, claimantsPage, setClaimantsPageSize, claimantsPageSize } =
		useDrop({
			ctx: web3ctx,
			claimId: claimId,
		})
	const [displayingPages, setDisplayingPages] = useState("")

	const _pageOptions = ["10", "25", "50"]

	useEffect(() => {
		if (!claimants.data) {
			return
		}
		const length = Math.min(claimants.data.length, claimantsPageSize)
		if (length === 0) {
			setDisplayingPages("no more claimants")
		} else {
			setDisplayingPages(
				`showing ${claimantsPage * claimantsPageSize + 1} to ${
					claimantsPage * claimantsPageSize + length
				}`,
			)
		}
	}, [claimantsPage, claimantsPageSize, claimants.data])

	useEffect(() => {
		setClaimantsPage(0)
	}, [claimId])

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
			const wrongAddressClaimant = claimants.find(
				(claimant) => !web3ctx.web3.utils.isAddress(claimant.address),
			)
			if (wrongAddressClaimant) {
				return new Promise((_, reject) => {
					reject(new Error(`${wrongAddressClaimant.address} is not valid address`))
				})
			}

			const wrongAmountClaimant = claimants.find(
				(claimant) => !claimant.amount || claimant.amount < 1,
			)
			if (wrongAmountClaimant) {
				return new Promise((_, reject) => {
					reject(
						new Error(
							`Wrong amount - ${wrongAmountClaimant.amount} - for ${wrongAmountClaimant.address}`,
						),
					)
				})
			}

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
			onError: (e: Error) => {
				toast(e.message, "error")
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
					<Flex direction="column" gap="20px">
						<Flex justifyContent="space-between" alignItems="center" mt="20px">
							<InputGroup w="500px">
								<Input
									value={searchString}
									onChange={(e) => setSearchString(e.target.value)}
									placeholder="search for address"
									borderRadius="10px"
									p="8px 15px"
								/>
								<InputRightElement
									w="80px"
									children={
										<Flex>
											<IconButton
												icon={<SmallCloseIcon />}
												_hover={{ color: "#ffccd4" }}
												bg="transparent"
												aria-label="clean"
												onClick={() => setSearchString("")}
												m="0"
												minW="20px"
											/>
											<IconButton
												_hover={{ color: "#ffccd4" }}
												bg="transparent"
												aria-label="search"
												icon={<SearchIcon />}
												minW="20px"
												onClick={() => handleSearchClick()}
												pl="10px"
											/>
										</Flex>
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
										onClick={() => {
											setSearchString("")
											onClose()
										}}
										_hover={{ bg: "#3f3f3f" }}
									/>
								</Flex>
							)}
						</Collapse>
						{claimants.isLoading && <Spinner />}
						{claimants.data && (
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
						)}
						<Flex alignItems="center" justifyContent="space-between" fontWeight="300">
							<Text>page {claimantsPage + 1}</Text>
							<Flex alignItems="center" justifyContent="center">
								<IconButton
									bg="transparent"
									aria-label="to start"
									_hover={{ bg: "#3f3f3f" }}
									icon={<Icon as={AiOutlineVerticalRight} />}
									onClick={() => setClaimantsPage(0)}
									disabled={claimantsPage < 1}
								/>
								<IconButton
									bg="transparent"
									aria-label="to start"
									_hover={{ bg: "#3f3f3f" }}
									icon={<Icon as={AiOutlineArrowLeft} />}
									onClick={() => setClaimantsPage(claimantsPage - 1)}
									disabled={claimantsPage < 1}
								/>
								<Text px="20px">{displayingPages}</Text>
								<IconButton
									bg="transparent"
									aria-label="to start"
									_hover={{ bg: "#3f3f3f" }}
									icon={<Icon as={AiOutlineArrowRight} />}
									onClick={() => setClaimantsPage(claimantsPage + 1)}
									disabled={!claimants.data || claimants.data.length < claimantsPageSize}
								/>
							</Flex>
							<Flex gap="15px" alignItems="center">
								<Select
									bg="transparent"
									color="white"
									borderRadius="10px"
									borderColor="#4d4d4d"
									size="sm"
									w="fit-content"
									onChange={(e) => {
										setClaimantsPageSize(Number(e.target.value))
									}}
									value={claimantsPageSize}
								>
									{_pageOptions.map((pageSize: string) => {
										return (
											<option key={`paginator-options-pagesize-${pageSize}`} value={pageSize}>
												{pageSize}
											</option>
										)
									})}
								</Select>
								<Text>per page</Text>
							</Flex>
						</Flex>
					</Flex>
				</AccordionPanel>
			</AccordionItem>
		</Accordion>
	)
}

export default ClaimantsView
