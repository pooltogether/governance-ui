import { request } from 'graphql-request'
import gql from 'graphql-tag'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { getGovernanceGraphUrl, QUERY_KEYS } from '../constants'
import { useQuery } from 'react-query'
import { isAddress } from 'ethers/lib/utils'

export const useVoteData = (delegateAddress, proposalId) => {
  const chainId = useGovernanceChainId()
  const addressError = !isAddress(delegateAddress)

  const results = useQuery(
    [QUERY_KEYS.voteDataQuery, chainId, delegateAddress, proposalId],
    async () => {
      return getVoteData(delegateAddress, proposalId, chainId)
    },
    {
      enabled: Boolean(chainId && delegateAddress && !addressError && proposalId),
      refetchInterval: false
    }
  )

  const { isFetched, isFetching, error } = results

  if (error) {
    console.error(error)
  }

  return {
    ...results
  }
}

async function getVoteData(delegateAddress, proposalId, chainId) {
  const query = voteDataQuery()

  const variables = { id: `${delegateAddress}-${proposalId}` }

  try {
    const subgraphData = await request(getGovernanceGraphUrl(chainId), query, variables)

    return {
      ...subgraphData.vote,
      delegateDidVote: subgraphData.vote?.support !== undefined
    }
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return {}
  }
}

const voteDataQuery = () => {
  return gql`
    query voteDataQuery($id: String!) {
      vote(id: $id) {
        support
      }
    }
  `
}
