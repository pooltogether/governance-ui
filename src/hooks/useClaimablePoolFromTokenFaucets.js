import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'
import { useOnboard, useGovernanceChainId, useReadProvider } from '@pooltogether/hooks'
import { batch, contract } from '@pooltogether/etherplex'

import { DEFAULT_TOKEN_PRECISION, QUERY_KEYS } from '../constants'
import { testAddress } from '../utils/testAddress'
import { useTokenFaucetAddresses } from '../hooks/useTokenFaucetAddresses'

export const useClaimablePoolFromTokenFaucets = () => {
  const { data: tokenFaucetAddresses, isFetched: tokenFaucetAddressesIsFetched } =
    useTokenFaucetAddresses()
  const { address: usersAddress } = useOnboard()
  const chainId = useGovernanceChainId()
  const { readProvider, isReadProviderReady } = useReadProvider(chainId)

  const addressError = testAddress(usersAddress)

  const enabled = Boolean(
    tokenFaucetAddressesIsFetched &&
      tokenFaucetAddresses &&
      usersAddress &&
      !addressError &&
      isReadProviderReady
  )

  return useQuery(
    [QUERY_KEYS.claimablePoolTotal, tokenFaucetAddresses, usersAddress, chainId],
    async () => {
      return getClaimablePoolFromTokenFaucets(readProvider, usersAddress, tokenFaucetAddresses)
    },
    {
      enabled
    }
  )
}

async function getClaimablePoolFromTokenFaucets(provider, usersAddress, tokenFaucetAddresses) {
  try {
    const responses = []
    for (const tokenFaucetAddress of tokenFaucetAddresses) {
      const tokenFaucetContract = contract(tokenFaucetAddress, TokenFaucetABI, tokenFaucetAddress)

      try {
        const tokenFaucetResponse = await batch(provider, tokenFaucetContract.claim(usersAddress))
        responses.push({
          id: tokenFaucetAddress,
          ...tokenFaucetResponse[tokenFaucetAddress]
        })
      } catch (e) {
        console.warn(e.message)
      }
    }

    const tokenFaucets = []
    responses.forEach((response) => {
      const claimableAmount = {
        id: response.id,
        claimableBN: response.claim[0],
        claimable: Number(ethers.utils.formatUnits(response.claim[0], DEFAULT_TOKEN_PRECISION))
      }
      tokenFaucets.push(claimableAmount)
    })

    const total = tokenFaucets.reduce((total, tokenFaucet) => total + tokenFaucet.claimable, 0)

    return { tokenFaucets, total }
  } catch (e) {
    console.error(e.message)
    return { tokenFaucets: [], total: 0 }
  }
}
