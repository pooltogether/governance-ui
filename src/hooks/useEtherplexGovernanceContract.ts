import { contract } from '@pooltogether/etherplex'
import { useGovernanceChainId } from '@pooltogether/hooks'

import { CONTRACT_ADDRESSES } from '../constants'
import GovernorAlphaABI from '../abis/GovernorAlphaABI'

export function useEtherplexGovernanceContract() {
  const chainId = useGovernanceChainId()
  const governanceAddress = CONTRACT_ADDRESSES[chainId]?.GovernorAlpha
  return contract('GovernorAlpha', GovernorAlphaABI, governanceAddress)
}
