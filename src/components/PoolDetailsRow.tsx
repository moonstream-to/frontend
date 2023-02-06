import { Flex, Text } from '@chakra-ui/layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MAX_INT } from '../constants'

const PoolDetailsRow = ({ type, value }: { type: string; value: string }) => {
  const [valueString, setValueString] = useState('')
  const valueComponent = () => {
    if (!value) {
      return <Text fontStyle='italic'>{String(value)}</Text>
    }
    if (value == MAX_INT) {
      return <Text fontStyle='italic'>MAX_INT</Text>
    }
    if (value.slice(0, 4) === 'http') {
      return (
        <Link href={value}>
          <Text
            title={value.length > valueString.length ? value : ''}
            fontFamily='Jet Brains Mono, monospace'
            fontWeight='400'
            fontSize='18px'
          >
            {valueString}
          </Text>
        </Link>
      )
    } else {
      return (
        <Text
          title={value.length > valueString.length ? value : ''}
          fontFamily='Jet Brains Mono, monospace'
          fontWeight='400'
          fontSize='18px'
        >
          {valueString}
        </Text>
      )
    }
  }

  useEffect(() => {
    if (!value) {
      return
    }
    const shortString = (fullString: string, atStart: number, atEnd: number) => {
      if (!fullString) {
        return fullString
      }
      if (fullString.length <= atStart + atEnd) {
        return fullString
      }
      return fullString.slice(0, atStart) + '...' + fullString.slice(-atEnd)
    }

    if (String(value).slice(0, 4) === 'http') {
      setValueString(shortString(String(value), 20, 10))
      return
    }
    if (String(value).slice(0, 2) === '0x') {
      setValueString(shortString(String(value), 6, 4))
      return
    }
    if (String(value).length > 30) {
      setValueString(shortString(String(value), 27, 3))
      return
    }
    setValueString(value)
  }, [value])
  return (
    <Flex justifyContent='space-between'>
      <Text fontWeight='400' fontSize='18px'>
        {type}
      </Text>
      {valueComponent()}
    </Flex>
  )
}

export default PoolDetailsRow
