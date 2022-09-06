import React from 'react'
import { useRouter } from 'next/router'
import { useTable } from 'react-table'
import {
  BasicTable,
  BlockExplorerLink,
  LinkTheme,
  LoadingDots,
  PoolIcon
} from '@pooltogether/react-components'
import { useGovernanceChainId } from '@pooltogether/hooks'

import { useTranslation } from 'react-i18next'
import { BlankStateMessage } from '../components/BlankStateMessage'
import { DefaultPaginationButtons } from '../components/PaginationUI'
import { useProposalVotes } from '../hooks/useProposalVotes'
import { formatVotes } from '../utils/formatVotes'
import { useProposalVotesTotalPages } from '../hooks/useProposalVotesTotalPages'
import { DelegateAddress } from '../components/DelegateAddress'

export const VotersTable = (props) => {
  const { id } = props

  const { t } = useTranslation()
  const router = useRouter()

  const { data: totalPages, isFetched: totalPagesIsFetched } = useProposalVotesTotalPages(id)
  const currentPage = router?.query?.page ? parseInt(router.query.page, 10) : 1
  const baseAsPath = `/proposals/${id}`
  const baseHref = '/proposals/[id]'

  const { data, isFetching, isFetched } = useProposalVotes(id, currentPage)

  const columns = React.useMemo(() => {
    return [
      {
        Header: t('voter'),
        accessor: 'voter',
        Cell: VoterCell,
        headerClassName: 'text-xs text-accent-1 font-light pb-2'
      },
      {
        Header: t('votingWeight'),
        accessor: 'votes',
        className: 'text-xxs xs:text-sm text-accent-1 pb-auto',
        headerClassName: 'text-xs text-accent-1 font-light pb-2'
      },
      {
        Header: t('decision'),
        accessor: 'support',
        Cell: SupportCell,
        className: 'text-xxs xs:text-sm text-accent-1 pb-auto',
        headerClassName: 'text-xs text-accent-1 font-light pb-2'
      }
    ]
  }, [])

  const rowData = React.useMemo(() => {
    if (!data || !data.votes) {
      return []
    }

    return data.votes.map((vote) => ({
      voter: vote.voter.id,
      votes: formatVotes(vote.votesRaw),
      support: vote.support
    }))
  }, [data])

  const tableInstance = useTable({
    columns,
    data: rowData
  })

  if (!totalPagesIsFetched) return null

  return (
    <>
      {totalPages === 0 ? (
        <BlankStateMessage>{t('noVotesHaveBeenCastYet')}</BlankStateMessage>
      ) : (
        <>
          <div className='basic-table-min-height'>
            {isFetching && !isFetched ? (
              <LoadingDots />
            ) : (
              <BasicTable tableInstance={tableInstance} />
            )}
          </div>

          <DefaultPaginationButtons
            currentPage={currentPage}
            totalPages={totalPages}
            baseAsPath={baseAsPath}
            baseHref={baseHref}
          />
        </>
      )}
    </>
  )
}

const SupportCell = (props) => {
  const { t } = useTranslation()

  if (props.value) {
    return t('accepted')
  }
  return t('rejected')
}

const VoterCell = (props) => {
  const chainId = useGovernanceChainId()

  if (props.value.toLowerCase() === '0x070a96fe4ad5155ea91d409e8afec6b2f3c729c0') {
    return (
      <BlockExplorerLink
        address={props.value}
        theme={LinkTheme.light}
        className='text-xxs xs:text-sm'
        chainId={chainId}
      >
        <PoolIcon className='mr-2 my-auto' />
        <span>POOL Pool Multisig</span>
      </BlockExplorerLink>
    )
  }

  return (
    <DelegateAddress
      theme={LinkTheme.light}
      className='text-xxxs xs:text-sm'
      address={props.value}
    />
  )
}
