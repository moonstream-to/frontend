import { useQuery } from 'react-query'
import axios from 'axios'

const ENTITY_API = process.env.NEXT_PUBLIC_ENTITY_API_URL
const WHITELIST_EVENT_COLLECTION_ID = process.env.NEXT_PUBLIC_WHITELIST_EVENT_COLLECTION_ID

const fetchSearchPublicEntity = (queryKey: any) => {
  const searchingAddress = queryKey.queryKey[1]
  return axios.get(`${ENTITY_API}/public/collections/${WHITELIST_EVENT_COLLECTION_ID}/search?required_field=address:${searchingAddress}`)
}

export const useSearchPublicEntity = (onSuccess: any, onError: any, searchingAddress: string) => {
  return useQuery(['search-public-entity', searchingAddress], fetchSearchPublicEntity, {
    onSuccess,
    onError,
    select: (data: any) => {
      return data?.data
    },
    enabled: false,
  })
}

const fetchCreatePublicEntity = (queryKey: any) => {
  const address = queryKey.queryKey[1]
  const email = queryKey.queryKey[2]
  const discord = queryKey.queryKey[3]
  const data = {
    address: address,
    blockchain: 'polygon',
    name: 'Public claimant',
    required_fields: [{ email: email }, { discord: discord }],
  }
  return axios.post(`${ENTITY_API}/public/collections/${WHITELIST_EVENT_COLLECTION_ID}/entities`, data)
}

export const useCreatePublicEntity = (onSuccess: any, onError: any, address: string, email: string, discord: string) => {
  return useQuery(['create-public-entity', address, email, discord], fetchCreatePublicEntity, {
    onSuccess,
    onError,
    select: (data: any) => {
      return data?.data
    },
    enabled: false,
  })
}
