/* eslint-disable @typescript-eslint/no-var-requires */
import { Button, Checkbox, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import TerminusPoolsList from './TerminusPoolsList'
import Web3Context from '../contexts/Web3Context/context'
const terminusAbi = require('../web3/abi/MockTerminus.json')
import { MockTerminus } from '../web3/contracts/types/MockTerminus'
import { useMutation } from 'react-query'


const TerminusPoolsListView = ({
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
  const [filter, setFilter] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const web3ctx = useContext(Web3Context)
  const [newPoolProps, setNewPoolProps] = useState<{capacity: string | undefined, isTransferable: boolean, isBurnable: boolean}>({capacity: undefined, isTransferable: true, isBurnable: true})

  const terminusFacet = new web3ctx.web3.eth.Contract(
    terminusAbi
  ) as any as MockTerminus;
  terminusFacet.options.address = contractAddress;

  const commonProps = {
    onSuccess: () => {
      toast({
        title: 'Successfully updated contract',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      // contractState.refetch(); //TODO
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  };

  const newPool = useMutation(
    ({
      capacity,
      isBurnable,
      isTransferable,
    }: {
      capacity: string;
      isBurnable: boolean;
      isTransferable: boolean;
    }) =>
      terminusFacet.methods
        .createPoolV1(capacity, isTransferable, isBurnable)
        .send({ from: web3ctx.account }),
    { ...commonProps }
  );

  const createNewPool = () => {
    const capacity = Number(newPoolProps.capacity)
    if (!capacity || !Number.isInteger(capacity) || capacity < 1) { return }
    newPool.mutate(
    { capacity: String(capacity),
      isTransferable: newPoolProps.isTransferable,
      isBurnable: newPoolProps.isBurnable,
    },
    {
      // onSettled: () => {}, TODO
    }
  );
  }



  return (
    <Flex direction='column' bg='#2d2d2d' borderRadius='20px' gap='30px' p='30px' w='400px' maxH='700px' color='white'>
      <Text fontWeight='700' fontSize='24px'>
        pools
      </Text>
      <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder='search' borderRadius='10px' p='8px 15px'/>

      <TerminusPoolsList contractAddress={contractAddress} onChange={onChange} selected={selected} filter={filter}/>
      
      {contractState && contractState.controller === web3ctx.account && <Button
        width='100%'
        bg='gray.0'
        fontWeight='700'
        fontSize='20px'
        color='#2d2d2d'
        onClick={onOpen}
      >
        + Add new
      </Button> }
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='black' border='1px solid white'>
          <ModalHeader>New pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input onChange={(e) => setNewPoolProps((prev) => {
              return {...prev, capacity: e.target.value}
              })} 
              placeholder='capacity' 
              type='number' 
              value={newPoolProps.capacity} 
            />
            <Checkbox 
              onChange={(e) => setNewPoolProps((prev) => {
                return {...prev, isBurnable: e.target.checked}
              })} 
              isChecked={newPoolProps.isBurnable}
            >Burnable</Checkbox>
            <Checkbox 
              onChange={(e) => setNewPoolProps((prevState) => {
                return {...prevState, isTransferable: e.target.checked}
              })} 
              isChecked={newPoolProps.isTransferable}
            >Transferable</Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant='ghost' onClick={() => {
                createNewPool()
                onClose()
                }}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default TerminusPoolsListView
