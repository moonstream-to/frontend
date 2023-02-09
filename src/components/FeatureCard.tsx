import Link from 'next/link'

import { Flex, Image, Text } from '@chakra-ui/react'

const FeatureCard = ({ feature }: { feature: { name: string; description: string; image: string; href: string } }) => {
  return (
    <Link href={feature.href}>
      <Flex
        direction='column'
        p='20px'
        bg='#353535'
        borderRadius='20px'
        w='215px'
        h='372px'
        color='white'
        textAlign='center'
        border='2px solid white'
        cursor='pointer'
      >
        <Image src={feature.image} w='170px' h='170px' alt={feature.name} mb='40px' />
        <Text fontSize='20px' fontWeight='500' mb='10px'>
          {feature.name}
        </Text>
        <Text fontSize='16px' fontWeight='400'>
          {feature.description}
        </Text>
      </Flex>
    </Link>
  )
}

export default FeatureCard
