import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { useGovernanceChainId, useReadProvider } from '@pooltogether/hooks'

import { CONTRACT_ADDRESSES, QUERY_KEYS } from 'lib/constants'
import GovernorAlphaABI from 'abis/GovernorAlphaABI'

export function useGovernorAlpha() {
  const chainId = useGovernanceChainId()
  const { readProvider, isReadProviderReady } = useReadProvider(chainId)

  return useQuery(
    [QUERY_KEYS.governorAlphaDataQuery, chainId],
    async () => {
      return getGovernorAlpha(readProvider, chainId)
    },
    {
      enabled: Boolean(chainId && isReadProviderReady),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

async function getGovernorAlpha(readProvider, chainId) {
  try {
    const governorAlphaAddress = CONTRACT_ADDRESSES[chainId]?.GovernorAlpha
    const governorAlphaContract = contract('governorAlpha', GovernorAlphaABI, governorAlphaAddress)

    const { governorAlpha } = await batch(
      readProvider,
      governorAlphaContract.proposalThreshold().quorumVotes().proposalMaxOperations()
    )

    return {
      proposalThreshold: governorAlpha.proposalThreshold[0],
      quorumVotes: governorAlpha.quorumVotes[0],
      proposalMaxOperations: governorAlpha.proposalMaxOperations[0].toNumber()
    }
  } catch (e) {
    console.error(e.message)
    return
  }
}
