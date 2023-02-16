import React, { useState, useEffect } from 'react'
import { Box, Button, Center, Flex, Input, Text, useToast, Select, Checkbox, Wrap } from '@chakra-ui/react'

import PageNavigation from './PageNavigation'
import { PAGE_SIZE } from '../../constants'
import CheckboxRow from '../CheckboxRow'

const TopBar = ({
  allColumns,
  goToTokenId,
  setGoToTokenId,
  activeTopbarRef,
  pageIndex,
  pageCount,
  pageOptions,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  globalFilter,
  setGlobalFilter,
}) => {
  // Collection
  const [selectedCollection, setSelectedCollection] = useState(undefined)
  const [collectionOptions, setCollectionOptions] = useState([])

  useEffect(() => {
    if (activeTopbarRef && activeTopbarRef.current && activeTopbarRef.current.scrollIntoView) {
      let goToPage = Math.floor(goToTokenId / PAGE_SIZE)
      gotoPage(goToPage)
      activeTopbarRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      })
    }
  }, [activeTopbarRef, goToTokenId])

  useEffect(() => {
    const tempCollectionOptions = [
      <option key={0} value={undefined}>
        Collection not selected
      </option>,
    ]
    setCollectionOptions(tempCollectionOptions)
  }, [allColumns])

  return (
    <Box>
      <Text fontSize='20px' py='10px' color='white' fontWeight='700'>
        Search and filter
      </Text>
      <Flex>
        <Flex>
          <Input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder='Global search' />
        </Flex>
        <Flex>
          <Select
            onChange={(event) => {
              setSelectedCollection(event.target.options[event.target.selectedIndex].value)
            }}
            name='collectionSelect'
          >
            {collectionOptions}
          </Select>
        </Flex>
      </Flex>
      <Text fontSize='20px' py='10px' color='white' fontWeight='700'>
        Columns visibility
      </Text>
      <Wrap>
        {allColumns.map((column) => (
          <Flex m='10px' minW='200px' key={column.Header}>
            <CheckboxRow key={column.Header} column={column} />
          </Flex>
        ))}
      </Wrap>

      <Text fontSize='20px' py='10px' color='white' fontWeight='700'>
        Navigation
      </Text>
      <Flex>
        <Flex>
          <Flex>
            <Flex>
              <Text color='white' fontWeight='700'>
                Go to token id
              </Text>
              <Input onChange={(event) => setGoToTokenId(event.target.value)} value={goToTokenId || ''} placeholder='0' type='number' />
            </Flex>
          </Flex>
          <Flex>
            <Flex>
              <Text color='white' fontWeight='700'>
                Jump to page
              </Text>
              <Input
                value={pageIndex + 1 || ''}
                onChange={(event) => {
                  const pageNumber = event.target.value ? Number(event.target.value) - 1 : 0
                  gotoPage(pageNumber)
                }}
                placeholder='0'
              />
            </Flex>
          </Flex>
        </Flex>

        {/* <Flex>
                    <PageNavigation
                        pageIndex={pageIndex}
                        pageCount={pageCount}
                        pageOptions={pageOptions}
                        gotoPage={gotoPage}
                        canPreviousPage={canPreviousPage}
                        previousPage={previousPage}
                        nextPage={nextPage}
                        canNextPage={canNextPage}
                    />
                </Flex> */}
      </Flex>
    </Box>
  )
}

export default TopBar
