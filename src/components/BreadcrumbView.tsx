import NextLink from "next/link"

import React, { useState, useEffect } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from "@chakra-ui/react"

import useRouter from "../hooks/useRouter"
import { ChevronRightIcon } from "@chakra-ui/icons"

const BreadcrumbView = () => {
  const [path, setPath] = useState<string[]>([])
  const router = useRouter()
  useEffect(() => {
    const newPath = router.nextRouter.pathname.split("/").slice(1)
    setPath(newPath)
  }, [router.nextRouter.pathname, router.query.contractAddress])
  return (
    <Breadcrumb
      spacing="8px"
      pt={2}
      px="7%"
      fontSize={["sm", "sm", "md"]}
      separator={<ChevronRightIcon color="gray.500" />}
    >
      {path.length !== 0 && (
        <BreadcrumbItem>
          <BreadcrumbLink textTransform={"capitalize"} href={"/"}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}
      {path?.map((element, idx) => {
        let linkPath = "/"
        path.forEach((value, index) => {
          if (index <= idx) linkPath += value + "/"
        })

        return (
          <BreadcrumbItem key={`bcl-${element}-${idx}`}>
            <BreadcrumbLink
              isCurrentPage={idx === path.length ? true : false}
              fontWeight={idx === path.length - 1 ? "semibold" : "normal"}
              textTransform={"capitalize"}
              href={linkPath}
            >
              {element}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default BreadcrumbView
