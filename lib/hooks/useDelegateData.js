import { useQuery } from 'react-query'
import gql from 'graphql-tag'
import { request } from 'graphql-request'
import { useGovernanceChainId } from '@pooltogether/hooks'

import { getGovernanceGraphUrl, QUERY_KEYS } from 'lib/constants'
import { testAddress } from 'lib/utils/testAddress'

export function useDelegateData(address) {
  const addressError = testAddress(address)
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
    const subgraphData = await request(getGovernanceGraphUrl(chainId), query, variables)
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
