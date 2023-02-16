import React, { useState, useEffect } from 'react'
import { Box, Button, Center, Flex, Input, Text, useToast, Select } from '@chakra-ui/react'

import { EMPTY_PROJECT_PLACEHOLDER } from '../../constants'

const ProjectBar = ({
  projectTokenMaps,
  setSelectedProjectToken,
  setSelectedProjectTokenDataUrl,
}: {
  projectTokenMaps: any
  setSelectedProjectToken: any
  setSelectedProjectTokenDataUrl: any
}) => {
  const [projectTokenOptions, setProjectTokenOptions] = useState([])

  useEffect(() => {
    // Generate list of project tokens
    let projectTokenTemp: any = [
      <option key={'undefined-project'} value={undefined}>
        {EMPTY_PROJECT_PLACEHOLDER}
      </option>,
    ]
    if (projectTokenMaps) {
      projectTokenMaps.forEach((projectTokenMap: any, i: any) => {
        projectTokenTemp.push(
          <option key={projectTokenMap.address} value={projectTokenMap.address}>
            {projectTokenMap.name}
          </option>,
        )
      })
      setProjectTokenOptions(projectTokenTemp)
    }
  }, [projectTokenMaps])

  return (
    <Flex>
      <Select
        bg='#1A1D22'
        onChange={(event: any) => {
          const selectedAddress = event.target.options[event.target.selectedIndex].value
          // Find selected project token to be able to extract s3 data url
          const tokenProjectMap = projectTokenMaps.find((obj: any) => obj.address == selectedAddress)
          setSelectedProjectTokenDataUrl(tokenProjectMap ? tokenProjectMap.s3_data_url : undefined)
          setSelectedProjectToken(event.target.options[event.target.selectedIndex].value)
        }}
        name='projectTokenSelect'
      >
        {projectTokenOptions}
      </Select>
    </Flex>
  )
}

export default ProjectBar
