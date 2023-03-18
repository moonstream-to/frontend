import React from "react"
import {
  deleteClaimants as _deleteClaimants,
  getClaimants,
  setClaimants,
} from "../services/moonstream-engine.service"
import { useMutation, useQuery, useQueryClient } from "react-query"
import useToast from "./useMoonToast"
import queryCacheProps from "./hookCommon"
import { MoonstreamWeb3ProviderInterface } from "../types/Moonstream"
import { AxiosError } from "axios"

const useDrop = ({
  ctx,
  claimId,
  getAll,
}: {
  ctx: MoonstreamWeb3ProviderInterface
  claimId?: string
  initialPageSize?: number
  getAll?: boolean
}) => {
  const toast = useToast()
  const queryClient = useQueryClient()

  const [claimantsPage, setClaimantsPage] = React.useState(0)
  const [claimantsPageSize, setClaimantsPageSize] = React.useState(5)

  const _getClaimants = async (page: number) => {
    const response = await getClaimants({ dropperClaimId: claimId })({
      limit: claimantsPageSize,
      offset: page * claimantsPageSize,
    })
    return response.data.claimants
  }
  const claimants = useQuery(
    ["claimants", "claimId", claimId, claimantsPage, claimantsPageSize],
    () => _getClaimants(claimantsPage),

    {
      ...queryCacheProps,
      enabled: !!ctx.account && claimantsPageSize != 0,
    },
  )

  const deleteClaimants = useMutation(_deleteClaimants({ dropperClaimId: claimId }), {
    onSuccess: () => {
      toast("Revoked claim", "success")
      claimants.refetch()
      queryClient.refetchQueries("/drops/claimants/search")
      queryClient.refetchQueries(["claimants", "claimId", claimId])
    },
    onError: () => {
      toast("Revoking claim failed", "error")
    },
  })

  const _getAllclaimants = async () => {
    const _claimants = []
    let offset = 0
    let response = await getClaimants({ dropperClaimId: claimId })({
      limit: 500,
      offset: offset,
    })
    _claimants.push(...response.data.claimants)

    while (response.data.drops.length == 500) {
      offset += 500
      response = await getClaimants({ dropperClaimId: claimId })({
        limit: 500,
        offset: offset,
      })
      _claimants.push(...response.data.claimants)
    }

    return _claimants
  }

  const AllClaimants = useQuery(
    ["AllClaimants", "claimId", claimId],
    () => _getAllclaimants(),

    {
      ...queryCacheProps,
      keepPreviousData: true,
      enabled: !!getAll,
    },
  )

  const uploadFile = useMutation(setClaimants, {
    onSuccess: () => {
      toast("File uploaded successfully", "success")
    },
    onError: (e: AxiosError) => {
      const msg = e.response?.data?.detail ?? "Uploading file failed"
      toast(msg, "error", 7000)
    },
  })

  return {
    claimants,
    deleteClaimants,
    setClaimantsPage,
    claimantsPage,
    setClaimantsPageSize,
    claimantsPageSize,
    AllClaimants,
    uploadFile,
  }
}

export default useDrop
