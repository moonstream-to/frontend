import {
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
import useRouter from '../hooks/useRouter'
import NextLink from 'next/link'

const BreadcrumbView = () => {
  const [path, setPath] = useState<string[]>([])
  const router = useRouter()
  useEffect(() => {
    console.log(router.nextRouter.pathname.split('/'))
    console.log(router.query)
    const newPath = router.nextRouter.pathname.split('/').slice(1)
    if (router.query?.contractAddress) {
      newPath.push(router.query.contractAddress)
    }
    setPath(newPath)
  }, [router.nextRouter.pathname])
  return (
    <Breadcrumb
      spacing='8px'
      pt={2}
      fontSize={['sm', 'sm', 'md']}
      separator={<ChevronRightIcon color='gray.500' />}
      px='7%'
    >
      {path.length !== 0 && (
        <BreadcrumbItem>
          <BreadcrumbLink textTransform={'capitalize'} href={`/`}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}
      {path?.map((element, idx) => {
        let linkPath = '/'
        path.forEach((value, index) => {
          if (index <= idx) linkPath += value + '/'
        })
        // console.log(linkPath)
        // console.log(router)
        const query =
          linkPath === '/terminus/' && router.query.contractAddress
            ? { contractAddress: router.query.contractAddress }
            : undefined
        // if (query) {
        //   path.push(query.contractAddress)
        // }
        return (
          <BreadcrumbItem key={`bcl-${element}-${idx}`}>
            <NextLink
              passHref
              shallow
              href={{ pathname: linkPath, query: { ...query } }}
            >
              <Text
                // isCurrentPage={idx === path.length ? true : false}
                fontWeight={idx === path.length - 1 ? 'semibold' : 'normal'}
                textTransform={'capitalize'}
              >
                {element}
              </Text>
            </NextLink>
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default BreadcrumbView
