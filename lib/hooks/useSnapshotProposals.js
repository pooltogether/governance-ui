import request, { gql } from 'graphql-request'
import { QUERY_KEYS } from 'lib/constants'
import { useQuery } from 'react-query'

const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.page/graphql'

export const useSnapshotProposals = () => {
  return useQuery([QUERY_KEYS.poolPoolProposal], () => getActiveProposal(), {
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false
  })
}

const getActiveProposal = async (snapshotProposalId) => {
  const query = proposalsQuery()
  const response = await request(SNAPSHOT_GRAPHQL_URL, query)
  return response.proposals
}

const proposalsQuery = () => {
  return gql`
    query Proposals {
      proposals(
        where: { space_in: ["poolpool.pooltogether.eth"], state: "active" }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        title
        body
        start
        end
        snapshot
        author
      }
    }
  `
}
