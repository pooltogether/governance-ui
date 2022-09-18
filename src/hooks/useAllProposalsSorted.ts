import { useMemo } from 'react'
import { PROPOSAL_STATUS } from '../constants'
import { useAllProposals } from '../hooks/useAllProposals'

export const SORTED_STATES = Object.freeze({
  executable: 'executable',
  approved: 'approved',
  active: 'active',
  pending: 'pending',
  past: 'past'
})

export function useAllProposalsSorted() {
  const { refetch, data: proposals, isFetching, isFetched, error } = useAllProposals()

  const sortedProposals = useMemo(() => {
    const executable = []
    const approved = []
    const active = []
    const pending = []
    const past = []

    if (!proposals) return { active, pending, past, approved, executable }

    Object.keys(proposals).forEach((id) => {
      const proposal = proposals[id]

      if (proposal.status === PROPOSAL_STATUS.queued) {
        executable.push(proposal)
      } else if (proposal.status === PROPOSAL_STATUS.succeeded) {
        approved.push(proposal)
      } else if (proposal.status === PROPOSAL_STATUS.pending) {
        pending.push(proposal)
      } else if (proposal.status === PROPOSAL_STATUS.active) {
        active.push(proposal)
      } else {
        past.push(proposal)
      }
    })

    return {
      [SORTED_STATES.executable]: executable.sort(compareProposals),
      [SORTED_STATES.approved]: approved.sort(compareProposals),
      [SORTED_STATES.active]: active.sort(compareProposals),
      [SORTED_STATES.pending]: pending.sort(compareProposals),
      [SORTED_STATES.past]: past.sort(compareProposals)
    }
  }, [proposals])

  return {
    refetch,
    sortedProposals,
    data: proposals,
    isFetching,
    isFetched,
    error
  }
}

function compareProposals(a, b) {
  return Number(b.endBlock) - Number(a.endBlock)
}
