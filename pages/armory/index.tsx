/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTable, usePagination, useGlobalFilter } from 'react-table'
import { Box, Button, Center, Flex, Input, Text, useToast } from '@chakra-ui/react'

import Layout from '../../src/components/layout'
import Spinner from '../../src/components/Spinner/Spinner'
import Web3Context from '../../src/contexts/Web3Context/context'
import { PAGE_SIZE, EMPTY_PROJECT_PLACEHOLDER, FUN_LOADING_PLACEHOLDER, FUN_EMPTY_PLACEHOLDER } from '../../src/constants'
import { useProjectTokenMaps, useTokenData } from '../../src/hooks/usePublicData'
import ProjectBar from '../../src/components/Armory/ProjectBar'
import TopBar from '../../src/components/Armory/TopBar'
import TableData from '../../src/components/Armory/TableData'

const Armory = () => {
  const toast = useToast()

  // Table and data states
  const [fetchedData, setFetchedData] = useState<any>(undefined)
  const [dataTokensLength, setDataTokensLength] = useState<number>(0)
  const [goToTokenId, setGoToTokenId] = useState<number>()
  const [activeTopbarRef, setActiveTopbarRef] = useState(null)

  // Selected project token to render
  const [selectedProjectToken, setSelectedProjectToken] = useState(EMPTY_PROJECT_PLACEHOLDER)
  const [selectedProjectTokenDataUrl, setSelectedProjectTokenDataUrl] = useState(undefined)

  const onSuccess = (data: any) => {}
  const onError = (error: any) => {
    toast({
      render: () => (
        <Box borderRadius='15px' border='2px solid #F56646' textAlign='center' color='#F56646' py={3} px={5} bg='#353535'>
          {error?.message}
        </Box>
      ),
      isClosable: true,
      position: 'top',
    })
  }

  const { isLoading: isLoadingProjectTokenMaps, data: projectTokenMaps } = useProjectTokenMaps(onSuccess, onError)
  const {
    isLoading: isLoadingDataTokens,
    data: dataTokens,
    isFetching: isFetchingDataTokens,
    refetch: dataTokensRefetch,
  } = useTokenData(onSuccess, onError, selectedProjectTokenDataUrl, selectedProjectToken)

  useEffect(() => {
    if (dataTokens) {
      setFetchedData(dataTokens)
    }
  }, [dataTokens, isLoadingDataTokens])

  useEffect(() => {
    // Handle project token selector
    if (selectedProjectTokenDataUrl && selectedProjectToken && selectedProjectToken != EMPTY_PROJECT_PLACEHOLDER) {
      dataTokensRefetch()
    }
  }, [selectedProjectToken])

  const columns = useMemo(() => {
    // columns - must be memorized
    let columnHeaders = []
    if (fetchedData) {
      for (const key in fetchedData[0]) {
        let keyName = key.replace('_', ' ')
        if (key === 'token_uri' || key == 'current_owner') {
          columnHeaders.push({
            Header: keyName,
            accessor: key,
            maxWidth: 600,
            minWidth: 400,
            width: 500,
          })
        } else {
          columnHeaders.push({
            Header: keyName,
            accessor: key,
            maxWidth: 150,
            minWidth: 140,
            width: 140,
          })
        }
      }
    }

    return columnHeaders
  }, [fetchedData])

  const data = useMemo(() => {
    // data - must be memorized
    if (fetchedData) {
      setDataTokensLength(fetchedData.length)
    }
    return fetchedData
  }, [fetchedData])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    state,
    setGlobalFilter,
    prepareRow,
    allColumns,
    flatRows,
  } = useTable(
    {
      columns: columns,
      data: data,
      initialState: { pageSize: PAGE_SIZE },
    },
    useGlobalFilter,
    usePagination,
  )
  const { globalFilter, pageIndex } = state

  return (
    <Layout home={false}>
      <Text pl='7%' fontSize='40px' py='40px' color='white' fontWeight='700'>
        Token armory
      </Text>
      <Flex fontSize='18px' direction='column' px='7%' color='white' mb='60px'>
        <ProjectBar
          projectTokenMaps={projectTokenMaps}
          setSelectedProjectToken={setSelectedProjectToken}
          setSelectedProjectTokenDataUrl={setSelectedProjectTokenDataUrl}
        />
        {allColumns.length > 0 && selectedProjectToken != EMPTY_PROJECT_PLACEHOLDER ? (
          <Flex direction='column'>
            <TopBar
              allColumns={allColumns}
              goToTokenId={goToTokenId}
              setGoToTokenId={setGoToTokenId}
              activeTopbarRef={activeTopbarRef}
              pageIndex={pageIndex}
              pageCount={pageCount}
              pageOptions={pageOptions}
              gotoPage={gotoPage}
              canPreviousPage={canPreviousPage}
              previousPage={previousPage}
              nextPage={nextPage}
              canNextPage={canNextPage}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            <TableData
              getTableProps={getTableProps}
              getTableBodyProps={getTableBodyProps}
              headerGroups={headerGroups}
              rows={page}
              prepareRow={prepareRow}
              goToTokenId={goToTokenId}
              setActiveTopbarRef={setActiveTopbarRef}
            />
          </Flex>
        ) : isLoadingDataTokens ? (
          <p>{FUN_LOADING_PLACEHOLDER}</p>
        ) : (
          <p>{FUN_EMPTY_PLACEHOLDER}</p>
        )}
      </Flex>
    </Layout>
  )
}

export default Armory
