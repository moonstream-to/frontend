/* eslint-disable @typescript-eslint/ban-types */
import Web3 from 'web3/types'
import { AbiItem } from 'web3-utils'

export interface WalletStatesInterface {
  ONBOARD: string
  CONNECT: string
  CONNECTED: string
  UNKNOWN_CHAIN: string
}

export type supportedChains = 'localhost' | 'mumbai' | 'polygon' | 'ethereum'

export interface ChainInterface {
  chainId: number
  name: supportedChains
  rpcs: Array<string>
}

export declare function GetMethodsAbiType<T>(abi: AbiItem[], name: keyof T): AbiItem

export interface TokenInterface {
  address: string
  deadline: number
  signed_message: string
}

declare function ChangeChain(chainName: supportedChains): void
export interface MoonstreamWeb3ProviderInterface {
  web3: Web3
  polygonClient: Web3
  wyrmClient: Web3
  onConnectWalletClick: Function
  buttonText: string
  WALLET_STATES: WalletStatesInterface
  account: string
  chainId: number
  defaultTxConfig: Object
  signAccessToken: Function
  getMethodsABI: typeof GetMethodsAbiType
  changeChain: typeof ChangeChain
  targetChain: ChainInterface | undefined
}

export interface UpdateClaim {
  claim_block_deadline?: string
  claim_id?: string
  description?: string
  dropper_claim_id?: string
  dropper_contract_id?: string
  terminus_address?: string
  terminus_pool_id?: string
  title?: string
}

export interface ClaimInterface {
  active: boolean
  claim_block_deadline: number
  drop_number: number
  description: string
  dropper_contract_address: string
  id: string
  terminus_address: string
  terminus_pool_id: number
  title: string
}
