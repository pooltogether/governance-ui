import { useEffect, useState } from 'react'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { getNetworkNameAliasByChainId } from '@pooltogether/utilities'

import { readProvider } from 'lib/services/readProvider'

export function useReadProvider() {
  const chainId = useGovernanceChainId()

  const [defaultReadProvider, setDefaultReadProvider] = useState({})

  useEffect(() => {
    const getReadProvider = async () => {
      const networkName = getNetworkNameAliasByChainId(chainId)
      if (networkName !== 'unknown network') {
        const defaultReadProvider = await readProvider(networkName)
        setDefaultReadProvider(defaultReadProvider)
      }
    }
    getReadProvider()
  }, [chainId])

  return {
    readProvider: defaultReadProvider,
    isLoaded: Object.keys(defaultReadProvider).length > 0
  }
}
