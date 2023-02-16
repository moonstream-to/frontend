import { useQuery } from 'react-query'
import axios from 'axios'

import { CACHE_TIME, STALE_TIME, AWS_S3_DATA_PATH } from '../constants'

const fetchProjectTokenMaps = () => {
  return axios.get(`${AWS_S3_DATA_PATH}/armory/token_projects_map.json`)
}

interface ProjectTokenMap {
  name: string
  address: string
  s3_data_url: string
}

// Fetch map of project tokens with names, blockchain addresses and link to s3 data
export const useProjectTokenMaps = (onSuccess: any, onError: any) => {
  return useQuery('project-tokens', fetchProjectTokenMaps, {
    onSuccess,
    onError,
    select: (data: any) => {
      const projectTokenMaps: ProjectTokenMap[] = data?.data.map((projectToken: any) => {
        return {
          name: projectToken.name,
          address: projectToken.address,
          s3_data_url: projectToken.s3_data_url,
        }
      })
      return projectTokenMaps
    },
    refetchOnWindowFocus: false,
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  })
}

const fetchTokenData = (queryKey: { queryKey: any[] }) => {
  const selectedProjectTokenDataUrl = queryKey.queryKey[1]
  if (selectedProjectTokenDataUrl) {
    return axios.get(selectedProjectTokenDataUrl)
  }
}

export const useTokenData = (onSuccess: any, onError: any, selectedProjectTokenDataUrl: any, selectedProjectToken: any) => {
  return useQuery([selectedProjectToken, selectedProjectTokenDataUrl], fetchTokenData, {
    onSuccess,
    onError,
    select: (data: any) => {
      return data?.data
    },
    refetchOnWindowFocus: false,
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
    enabled: false, // Do not fetch data when component mounts
  })
}
