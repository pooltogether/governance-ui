import { contract } from '@pooltogether/etherplex'
import { useGovernanceChainId } from '@pooltogether/hooks'
import GovernorAlphaABI from '../abis/GovernorAlphaABI'
import { CONTRACT_ADDRESSES } from '../constants'

export function useEtherplexGovernanceContract() {
  const chainId = useGovernanceChainId()
  const governanceAddress = CONTRACT_ADDRESSES[chainId]?.GovernorAlpha
  return contract('GovernorAlpha', GovernorAlphaABI, governanceAddress)
}
