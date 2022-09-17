import { useGovernanceChainId } from '@pooltogether/hooks'
import { getReadProvider } from '@pooltogether/wallet-connection'
import { useQuery } from 'react-query'

export const useBlock = (blockNumber: number) => {
  const chainId = useGovernanceChainId()
  const readProvider = getReadProvider(chainId)

  return useQuery(['useBlock', blockNumber?.toString()], () => readProvider.getBlock(blockNumber), {
    enabled: !!blockNumber
  })
}
