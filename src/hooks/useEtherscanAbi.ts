import { useGovernanceChainId } from '@pooltogether/hooks'
import { isAddress } from 'ethers/lib/utils'
import { useQuery } from 'react-query'
import { axiosInstance } from '../axiosInstance'
import { ETHERSCAN_API_KEY, QUERY_KEYS } from '../constants'

const ETHERSCAN_URI = `https://api.etherscan.io/api`

export const useEtherscanAbi = (contractAddress, disableQuery = false) => {
  const chainId = useGovernanceChainId()

  const isValid = isAddress(contractAddress)

  return useQuery(
    [QUERY_KEYS.etherscanContractAbi, chainId, contractAddress],
    async () => {
      return getEtherscanAbi(contractAddress)
    },
    {
      // TODO: This only works for mainnet, so check chainId
      enabled: Boolean(chainId && isValid && contractAddress && !disableQuery),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

const getEtherscanAbi = async (contractAddress) => {
  return axiosInstance.get(
    `${ETHERSCAN_URI}?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`
  )
}
