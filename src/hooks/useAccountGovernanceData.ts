import { useQuery } from 'react-query'
import gql from 'graphql-tag'
import { request } from 'graphql-request'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { MAINNET_POLLING_INTERVAL, QUERY_KEYS } from '../constants'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useUsersAddress } from '@pooltogether/wallet-connection'
import { isAddress } from 'ethers/lib/utils'
import { getGovernanceSubgraphUrl } from '@pooltogether/utilities'

export const accountGovernanceDataQueryAtom = atom({})

export function useAccountGovernanceData() {
  const { refetch, data, isFetching, isFetched, error } = useAccountGovernanceDataQuery()

  const [accountGovernanceData, setAccountGovernanceData] = useAtom(accountGovernanceDataQueryAtom)

  if (error) {
    console.error(error)
  }

  useEffect(() => {
    setAccountGovernanceData({
      refetch,
      data,
      isFetching,
      isFetched,
      error
    })
  }, [isFetching, isFetched])

  return {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  }
}

function useAccountGovernanceDataQuery() {
  const usersAddress = useUsersAddress()
  const chainId = useGovernanceChainId()
  const error = !isAddress(usersAddress)

  const refetchInterval = MAINNET_POLLING_INTERVAL

  return useQuery(
    [QUERY_KEYS.accountGovernanceDataQuery, chainId, usersAddress],
    async () => {
      return getAccountGovernanceData(chainId, usersAddress)
    },
    {
      enabled: Boolean(chainId && usersAddress && !error),
      refetchInterval
    }
  )
}

async function getAccountGovernanceData(chainId, accountAddress) {
  const query = accountGovernanceDataQuery()

  const variables = {
    accountAddress: accountAddress
  }

  try {
    const data = await request(
      getGovernanceSubgraphUrl(chainId, process.env.NEXT_PUBLIC_THE_GRAPH_API_KEY),
      query,
      variables
    )

    return data
  } catch (error) {
    console.error(JSON.stringify(error, undefined, 2))
    return {}
  }
}

const accountGovernanceDataQuery = () => {
  return gql`
    query accountGovernanceDataQuery($accountAddress: String!) {
      proposals(where: { proposer: $accountAddress }) {
        id
        proposer {
          id
        }
      }
    }
  `
}
