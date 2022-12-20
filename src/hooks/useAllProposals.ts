import { Block } from '@ethersproject/abstract-provider'
import { BaseProvider } from '@ethersproject/providers'
import { batch, contract } from '@pooltogether/etherplex'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { getGovernanceSubgraphUrl } from '@pooltogether/utilities'
import { getReadProvider } from '@pooltogether/wallet-connection'
import { request } from 'graphql-request'
import gql from 'graphql-tag'
import { isEmpty } from 'lodash'
import { DateTime } from 'luxon'
import { useQuery } from 'react-query'
import { useBlockNumber } from 'wagmi'
import GovernorAlphaABI from '../abis/GovernorAlphaABI'
import { CONTRACT_ADDRESSES, PROPOSAL_STATES, QUERY_KEYS, SECONDS_PER_BLOCK } from '../constants'
import { useBlock } from './useBlock'

export function useAllProposals() {
  const { refetch, data, isFetching, isFetched, error } = useFetchProposals()

  if (error) {
    console.error(error)
  }

  return {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  }
}

function useFetchProposals() {
  const chainId = useGovernanceChainId()
  const readProvider = getReadProvider(chainId)
  const { data: blockNumber } = useBlockNumber({ chainId: chainId })
  const { data: block } = useBlock(blockNumber)

  return useQuery(
    [QUERY_KEYS.proposalsQuery, chainId, blockNumber],
    async () => {
      return getProposals(readProvider, chainId, block)
    },
    {
      enabled: Boolean(chainId && !isEmpty(block))
    }
  )
}

async function getProposals(provider: BaseProvider, chainId: number, block: Block) {
  const query = proposalsQuery()
  const governanceAddress = CONTRACT_ADDRESSES[chainId]?.GovernorAlpha

  try {
    const proposals = {}

    const subgraphData = await request(
      getGovernanceSubgraphUrl(chainId, process.env.NEXT_PUBLIC_THE_GRAPH_API_KEY),
      query
    )

    const batchCalls = []
    subgraphData.proposals.forEach((proposal) => {
      const governanceContract = contract(proposal.id, GovernorAlphaABI, governanceAddress)
      batchCalls.push(governanceContract.proposals(proposal.id))
      batchCalls.push(governanceContract.state(proposal.id))
    })

    const proposalChainData = await batch(provider, ...batchCalls)

    const blockNumber = block.number
    const currentTimestamp = block.timestamp
    subgraphData.proposals.forEach((proposal) => {
      const { id, description } = proposal

      const endDateSeconds =
        currentTimestamp + SECONDS_PER_BLOCK * (Number(proposal.endBlock) - blockNumber)
      const endDate = DateTime.fromSeconds(endDateSeconds)

      proposals[id] = {
        ...proposal,
        title: description?.split(/# |\n/g)[1] || 'Untitled',
        description: description || 'No description.',
        againstVotes: proposalChainData[id].proposals.againstVotes,
        forVotes: proposalChainData[id].proposals.forVotes,
        totalVotes: proposalChainData[id].proposals.forVotes.add(
          proposalChainData[id].proposals.againstVotes
        ),
        status: PROPOSAL_STATES[proposalChainData[id].state[0]],
        endDateSeconds,
        endDate
      }
    })

    return proposals
  } catch (error) {
    // console.error(JSON.stringify(error.message, undefined, 2))
    // throw new Error(error)
    return {
      proposals: {},
      error
    }
  }
}

const proposalsQuery = () => {
  return gql`
    query proposalsQuery {
      proposals {
        id
        proposer {
          id
          delegatedVotesRaw
          delegatedVotes
          tokenHoldersRepresentedAmount
        }
        targets
        values
        signatures
        calldatas
        startBlock
        endBlock
        description
        status
        executionETA
      }
    }
  `
}
