import { useGovernanceChainId } from '@pooltogether/hooks'
import { getGovernanceSubgraphUrl } from '@pooltogether/utilities'
import { isAddress } from 'ethers/lib/utils'
import { request } from 'graphql-request'
import gql from 'graphql-tag'
import { useQuery } from 'react-query'
import { useBlockNumber } from 'wagmi'
import { QUERY_KEYS } from '../constants'

const EMPTY_TOKEN_HOLDER = Object.freeze({
  delegatedVotes: null,
  tokenHoldersRepresentedAmount: null,
  delegate: null,
  tokenBalance: '0',
  isDelegating: false,
  isSelfDelegated: false,
  hasBalance: false,
  canVote: false
})

export function useTokenHolder(address: string, blockNumber?: number) {
  const chainId = useGovernanceChainId()
  const { data: _blockNumber } = useBlockNumber({ chainId: chainId })

  // Only add filter if it is in the past
  const isDataFromBeforeCurrentBlock = !!_blockNumber && blockNumber && blockNumber < _blockNumber
  const blockNumberToQuery = isDataFromBeforeCurrentBlock ? blockNumber : undefined

  const { refetch, data, isFetching, isFetched, error } = useFetchTokenHolder(
    address,
    blockNumberToQuery
  )

  if (error) {
    console.error(error)
  }

  return {
    isDataFromBeforeCurrentBlock,
    refetch,
    data,
    isFetching,
    isFetched,
    error
  }
}

function useFetchTokenHolder(address, blockNumber) {
  const chainId = useGovernanceChainId()
  const addressError = !isAddress(address)

  return useQuery(
    [QUERY_KEYS.tokenHolderQuery, chainId, address, blockNumber],
    async () => {
      return getTokenHolder(address, chainId, blockNumber)
    },
    {
      enabled: Boolean(chainId && address && !addressError)
    }
  )
}

async function getTokenHolder(address, chainId, blockNumber) {
  try {
    const query = tokenHolderQuery(blockNumber)
    const variables = { id: address.toLowerCase() }
    const subgraphData = await request(
      getGovernanceSubgraphUrl(chainId, process.env.NEXT_PUBLIC_THE_GRAPH_API_KEY),
      query,
      variables
    )

    if (!subgraphData.tokenHolder && !subgraphData.delegate) {
      return EMPTY_TOKEN_HOLDER
    }

    const isDelegating = Boolean(subgraphData?.tokenHolder?.delegate?.id)
    const isSelfDelegated =
      address.toLowerCase() === subgraphData?.tokenHolder?.delegate?.id?.toLowerCase()
    const hasBalance = Number(subgraphData?.tokenHolder?.tokenBalance) > 0
    const canVote = Number(subgraphData?.delegate?.delegatedVotes || 0) > 0
    const tokenBalance = subgraphData?.tokenHolder?.tokenBalance || '0'
    const isBeingDelegatedTo =
      subgraphData?.delegate?.tokenHoldersRepresentedAmount >= 2 ||
      (subgraphData?.delegate?.tokenHoldersRepresentedAmount === 1 &&
        subgraphData?.delegate?.delegatedVotes !== tokenBalance)
    const tokenHoldersRepresentedAmount = isSelfDelegated
      ? String(Number(subgraphData?.delegate?.tokenHoldersRepresentedAmount) - 1)
      : subgraphData?.delegate?.tokenHoldersRepresentedAmount

    return {
      ...subgraphData.delegate,
      ...subgraphData.tokenHolder,
      tokenHoldersRepresentedAmount,
      tokenBalance,
      isBeingDelegatedTo,
      isDelegating,
      isSelfDelegated,
      hasBalance,
      canVote
    }
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return EMPTY_TOKEN_HOLDER
  }
}

const tokenHolderQuery = (blockNumber) => {
  const blockFilter = blockNumber ? `, block: { number: ${blockNumber} }` : ''

  return gql`
    query tokenHolderQuery($id: String!) {
      tokenHolder(id: $id ${blockFilter}) {
        delegate {
          id
          delegatedVotes
          tokenHoldersRepresentedAmount
        }
        tokenBalance
      }
      delegate(id: $id ${blockFilter}) {
        delegatedVotes
        tokenHoldersRepresentedAmount
      }
    }
  `
}
