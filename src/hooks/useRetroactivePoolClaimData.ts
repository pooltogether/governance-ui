import { batch, contract } from '@pooltogether/etherplex'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { useUsersAddress } from '@pooltogether/wallet-connection'
import { getReadProvider } from '@pooltogether/wallet-connection'
import { ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { useQuery } from 'react-query'
import MerkleDistributorAbi from '../abis/MerkleDistributor'
import { axiosInstance } from '../axiosInstance'
import { CONTRACT_ADDRESSES, QUERY_KEYS } from '../constants'

export const useRetroactivePoolClaimData = (address) => {
  const { refetch, data, isFetching, isFetched, error } = useFetchRetroactivePoolClaimData(address)

  return {
    loading: !isFetched,
    refetch,
    data,
    isFetching,
    isFetched,
    error
  }
}

const useFetchRetroactivePoolClaimData = (address) => {
  const usersAddress = useUsersAddress()
  const chainId = useGovernanceChainId()
  const readProvider = getReadProvider(chainId)

  if (!address) {
    address = usersAddress
  }

  const addressError = !isAddress(usersAddress)

  return useQuery(
    [QUERY_KEYS.retroactivePoolClaimDataQuery, address, chainId],
    async () => {
      return getRetroactivePoolClaimData(readProvider, chainId, address)
    },
    {
      enabled: Boolean(address && !addressError),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  )
}

const getRetroactivePoolClaimData = async (provider, chainId, usersAddress) => {
  const checksummedAddress = ethers.utils.getAddress(usersAddress)
  let merkleDistributionData: { amount: string; index: number } = {
    amount: undefined,
    index: undefined
  }

  try {
    const response = await getMerkleDistributionData(checksummedAddress, chainId)
    merkleDistributionData = response.data
  } catch (e) {
    return {
      isMissing: true,
      isClaimed: false,
      formattedAmount: 0
    }
  }

  const formattedAmount = Number(
    ethers.utils.formatUnits(ethers.BigNumber.from(merkleDistributionData.amount).toString(), 18)
  )

  const isClaimed = await getIsClaimed(provider, chainId, merkleDistributionData.index)

  return {
    ...merkleDistributionData,
    formattedAmount,
    isClaimed
  }
}

const getMerkleDistributionData = async (usersAddress, chainId) => {
  return await axiosInstance.get(
    `https://merkle.pooltogether.com/.netlify/functions/merkleAddressData?address=${usersAddress}${
      chainId === 4 ? '&chainId=4&testVersion=v4' : ''
    }`
  )
}

const getIsClaimed = async (provider, chainId, index) => {
  const merkleDistributorContract = contract(
    'merkleDistributor',
    MerkleDistributorAbi,
    CONTRACT_ADDRESSES[chainId].MerkleDistributor
  )
  const { merkleDistributor } = await batch(provider, merkleDistributorContract.isClaimed(index))

  return merkleDistributor.isClaimed[0]
}
