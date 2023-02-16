import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
  useToast,
  Select,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

const TableDataRow = ({ row, goToTokenId, setActiveTopbarRef }) => {
  const itemRef = useRef(null)

  useEffect(() => {
    // Responsible for scrolling to row
    if (goToTokenId && row.id == goToTokenId) {
      setActiveTopbarRef(itemRef)
    }
  }, [goToTokenId])

  return (
    <Tr key={row.id} {...row.getRowProps()} ref={itemRef}>
      {row.cells.map((cell) => {
        return (
          <Td
            key={cell.value}
            {...cell.getCellProps({
              style: {
                minWidth: cell.column.minWidth,
                width: cell.column.width,
                maxWidth: cell.column.maxWidth,
              },
            })}
          >
            {cell.render('Cell')}
          </Td>
        )
      })}
    </Tr>
  )
}

export default TableDataRow
