import { useUsersAddress } from '@pooltogether/wallet-connection'
import { ethers } from 'ethers'
import { DEFAULT_TOKEN_PRECISION } from '../constants'
import { useGovernorAlpha } from '../hooks/useGovernorAlpha'
import { useTokenHolder } from './useTokenHolder'

export const useUserCanCreateProposal = () => {
  const usersAddress = useUsersAddress()
  const { data: governorAlpha, isFetched: governorAlphaIsFetched } = useGovernorAlpha()
  const { data: tokenHolder, isFetched: isTokenHolderFetched } = useTokenHolder(usersAddress)

  if (!isTokenHolderFetched || !governorAlphaIsFetched) {
    return {
      isFetched: false,
      userCanCreateProposal: false
    }
  }

  if (!tokenHolder) {
    return {
      isFetched: true,
      userCanCreateProposal: false
    }
  }

  return {
    isFetched: true,
    userCanCreateProposal:
      tokenHolder.canVote &&
      Number(tokenHolder.delegatedVotes) >=
        Number(ethers.utils.formatUnits(governorAlpha.proposalThreshold, DEFAULT_TOKEN_PRECISION))
  }
}
