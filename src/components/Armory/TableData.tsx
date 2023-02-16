import React, { useState, useEffect } from 'react'
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

import TableDataRow from './TableDataRow'

const TableData = ({ getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, goToTokenId, setActiveTopbarRef }) => {
  return (
    <Flex maxW='400px' w='100%'>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr key={'headerGroup'} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  key={column.Header}
                  {...column.getHeaderProps({
                    style: {
                      minWidth: column.minWidth,
                      width: column.width,
                      maxWidth: column.maxWidth,
                    },
                  })}
                >
                  {column.render('Header')}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return <TableDataRow key={row.id} row={row} setActiveTopbarRef={setActiveTopbarRef} goToTokenId={goToTokenId} />
          })}
        </Tbody>
      </Table>
    </Flex>
  )
}

export default TableData
