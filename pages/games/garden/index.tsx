/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from 'react'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box, Heading, HStack, Spacer } from '@chakra-ui/react'

import SessionPanel from '../../../src/components/gofp/GoFPSessionPanel'
import MetadataPanel from '../../../src/components/gofp/GoFPMetadataPanel'
import CharacterPanel from '../../../src/components/gofp/GoFPCharacterPanel'
import { useRouter } from '../../../src/hooks'
import Layout from '../../../src/components/layout'
import useGofp from '../../../src/contexts/GoFPContext'
import { CustomDragLayer } from '../../../src/components/gofp/CustomDragLayer'

const Garden = () => {
  const router = useRouter()

  const { setSessionId, setGardenContractAddress } = useGofp()

  useEffect(() => {
    setSessionId(router.query['sessionId'])
    setGardenContractAddress(router.query['contractId'])
  }, [])

  return (
    <Layout home={false}>
      <Box className='Garden' borderRadius={'xl'} pt={10} minH='100vh' bgColor='#1A1D22' px='7%' color='white'>
        <Heading>Garden of Forking Paths</Heading>
        <DndProvider backend={HTML5Backend}>
          <CustomDragLayer />
          <HStack my='10' alignItems='top'>
            <MetadataPanel />
            <Spacer />
            <SessionPanel />
            <Spacer />
            <CharacterPanel />
          </HStack>
        </DndProvider>
      </Box>
    </Layout>
  )
}

export default Garden
