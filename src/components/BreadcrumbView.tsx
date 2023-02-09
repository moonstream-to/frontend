import NextLink from 'next/link'

import React, { useState, useEffect } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text } from '@chakra-ui/react'

import useRouter from '../hooks/useRouter'

const BreadcrumbView = () => {
  const [path, setPath] = useState<string[]>([])
  const router = useRouter()
  useEffect(() => {
    const newPath = router.nextRouter.pathname.split('/').slice(1)
    setPath(newPath)
  }, [router.nextRouter.pathname, router.query.contractAddress])
  return (
    <Breadcrumb spacing='8px' pt={2} fontSize={['sm', 'sm', 'md']} separator={'/'} px='7%'>
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

        const query =
          linkPath === '/terminus/' && router.query.contractAddress ? { contractAddress: router.query.contractAddress } : undefined
        return (
          <React.Fragment key={`bcl-${element}-${idx}`}>
            {query ? (
              <>
                <BreadcrumbItem>
                  <NextLink passHref shallow href={ '/terminus' }>
                    <Text fontWeight={'normal'} textTransform={'capitalize'}>
                      Terminus
                    </Text>
                  </NextLink>
                </BreadcrumbItem>
                <Text mx={2}>/</Text>
                <BreadcrumbItem>
                  <Text fontWeight={idx === path.length - 1 ? 'semibold' : 'normal'} textTransform={'capitalize'}>
                    {router.query.contractAddress}
                  </Text>
                </BreadcrumbItem>
              </>
            ) : (
            <BreadcrumbItem>
              <NextLink passHref shallow href={{ pathname: linkPath }}>
                <Text fontWeight={idx === path.length - 1 ? 'semibold' : 'normal'} textTransform={'capitalize'}>
                  {element}
                </Text>
              </NextLink>
            </BreadcrumbItem>
            )}
          </React.Fragment>
        )
      })}
    </Breadcrumb>
  )
}

export default BreadcrumbView
