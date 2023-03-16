import { HTMLAttributes, useEffect, useState } from "react"
import { Flex, Link, Text } from "@chakra-ui/layout"

import { MAX_INT } from "../constants"

interface DetailsProps extends HTMLAttributes<HTMLElement> {
  type: string
  value: string
  href?: string
  displayFull?: boolean
}

const PoolDetailsRow = ({ type, value, displayFull, href, ...props }: DetailsProps) => {
  const [valueString, setValueString] = useState("")

  const valueComponent = () => {
    if (!value) {
      return <Text fontStyle="italic">{String(value)}</Text>
    }
    if (value == MAX_INT) {
      return <Text fontStyle="italic">MAX_INT</Text>
    }
    if (value.slice(0, 4) === "http" && !href) {
      return (
        <Link
          href={value}
          target="_blank"
          color="orange.1000"
          _hover={{ color: "orange.400", textDecoration: "none" }}
        >
          <Text
            title={value.length > valueString.length ? value : ""}
            fontFamily="Jet Brains Mono, monospace"
            fontWeight="400"
            fontSize="18px"
          >
            {valueString}
          </Text>
        </Link>
      )
    } else {
      return (
        <Text
          title={value.length > valueString.length ? value : ""}
          fontFamily="Jet Brains Mono, monospace"
          fontWeight="400"
          fontSize="18px"
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
    if (displayFull) {
      setValueString(value)
      return
    }
    const shortString = (fullString: string, atStart: number, atEnd: number) => {
      if (!fullString) {
        return fullString
      }
      if (fullString.length <= atStart + atEnd) {
        return fullString
      }
      return fullString.slice(0, atStart) + "..." + fullString.slice(-atEnd)
    }

    if (String(value).slice(0, 4) === "http") {
      setValueString(shortString(String(value), 20, 10))
      return
    }
    if (String(value).slice(0, 2) === "0x") {
      setValueString(shortString(String(value), 6, 4))
      return
    }
    if (String(value).length > 30) {
      setValueString(shortString(String(value), 27, 3))
      return
    }
    setValueString(value)
  }, [value, displayFull])

  return (
    <Flex justifyContent="space-between" {...props}>
      <Text fontWeight="400" fontSize="18px">
        {type}
      </Text>
      {href ? (
        <Link
          href={href}
          color="orange.1000"
          _hover={{ color: "orange.400", textDecoration: "none" }}
          target="_blank"
        >
          {valueComponent()}
        </Link>
      ) : (
        valueComponent()
      )}
    </Flex>
  )
}

export default PoolDetailsRow
