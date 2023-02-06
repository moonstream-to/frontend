/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import Layout from '../../src/components/layout';
import {
  useSearchPublicEntity,
  useCreatePublicEntity,
} from '../../src/hooks/usePublicEntities';

const Whitelist = () => {
  const toast = useToast();
  const [searchingAddress, setSearchingAddress] = useState('');
  const [claimedAddress, setClaimedAddress] = useState('');

  const onSuccess = () => {
    // Handle successful request
  };
  const onError = (error: any) => {
    console.log(error?.message);
    toast({
      render: () => (
        <Box
          borderRadius='5px'
          textAlign='center'
          color='black'
          p={1}
          bg='red.600'
        >
          {error?.message}
        </Box>
      ),
      isClosable: true,
    });
  };

  const {
    isLoading: isLoadingSearch,
    data: dataSearch,
    isFetching: isFetchingSearch,
    refetch: refetchSearch,
  } = useSearchPublicEntity(onSuccess, onError, searchingAddress);
  const {
    isLoading: isLoadingCreate,
    data: dataCreate,
    isFetching: isFetchingCreate,
    refetch: refetchCreate,
  } = useCreatePublicEntity(onSuccess, onError, searchingAddress);

  const handleSubmit = () => {
    refetchSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (dataSearch) {
      if (dataSearch.total_results === 0) {
        refetchCreate();
      }
    }
  }, [dataSearch]);

  useEffect(() => {
    if (dataCreate) {
      setClaimedAddress(dataCreate.address);
    }
  }, [dataCreate]);

  return (
    <Layout home={true}>
      <Center>
        <Flex gap='30px' direction='column' px='7%' py='30px' color='white'>
          <Flex gap='20px'>
            <Input
              onKeyDown={handleKeyDown}
              w='50ch'
              placeholder='wallet address'
              type='text'
              value={searchingAddress}
              onChange={(e) => setSearchingAddress(e.target.value)}
            />
            <Button
              bg='gray.0'
              fontWeight='400'
              fontSize='18px'
              color='#2d2d2d'
              onClick={handleSubmit}
            >
              Claim
            </Button>
          </Flex>
          {claimedAddress && (
            <Flex
              direction='column'
              gap='20px'
              bg='#2d2d2d'
              borderRadius='10px'
              p='20px'
            >
              <Text>Claimed for {claimedAddress}</Text>
            </Flex>
          )}
        </Flex>
      </Center>
    </Layout>
  );
};

export default Whitelist;
