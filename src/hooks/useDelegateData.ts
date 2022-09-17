import { useQuery } from 'react-query'
import gql from 'graphql-tag'
import { request } from 'graphql-request'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { QUERY_KEYS } from '../constants'
import { isAddress } from 'ethers/lib/utils'
import { getGovernanceSubgraphUrl } from '@pooltogether/utilities'

export function useDelegateData(address) {
  const addressError = !isAddress(address)
  const chainId = useGovernanceChainId()

  return useQuery(
    [QUERY_KEYS.delegateDataQuery, chainId, address],
    async () => {
      return getDelegateData(address, chainId)
    },
    {
      enabled: Boolean(chainId && address && !addressError)
    }
  )
}

async function getDelegateData(address, chainId) {
  const query = delegateDataQuery()

  const variables = { id: address.toLowerCase() }

  try {
    const subgraphData = await request(
      getGovernanceSubgraphUrl(chainId, process.env.NEXT_PUBLIC_THE_GRAPH_API_KEY),
      query,
      variables
    )
    return {
      ...subgraphData.delegate
    }
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return {}
  }
}

const delegateDataQuery = () => {
  return gql`
    query delegateQuery($id: String!) {
      delegate(id: $id) {
        id
        delegatedVotesRaw
        tokenHoldersRepresentedAmount
        votes {
          id
        }
        proposals(first: 5, orderBy: id, orderDirection: desc) {
          id
        }
      }
    }
  `
}
