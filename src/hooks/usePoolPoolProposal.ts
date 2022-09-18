import request, { gql } from 'graphql-request'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from '../constants'
import { getPoolPoolSnapshotId } from '../utils/getPoolPoolSnapshotId'

const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql'

export const usePoolPoolProposal = (chainId, proposalId) => {
  const poolPoolSnapShotId = getPoolPoolSnapshotId(chainId, proposalId)
  const enabled = Boolean(poolPoolSnapShotId)
  return useQuery(
    [QUERY_KEYS.poolPoolProposal, chainId, proposalId],
    () => getPoolPoolProposal(poolPoolSnapShotId),
    { enabled, refetchInterval: false, refetchOnReconnect: false, refetchOnWindowFocus: false }
  )
}

const getPoolPoolProposal = async (snapshotProposalId) => {
  const query = proposalsQuery()
  const variables = { id: snapshotProposalId }
  return await request(SNAPSHOT_GRAPHQL_URL, query, variables)
}

const proposalsQuery = () => {
  return gql`
    query Proposal($id: String!) {
      proposal(id: $id) {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        space {
          id
          name
        }
      }
    }
  `
}
