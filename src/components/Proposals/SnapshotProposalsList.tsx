import { ButtonLink } from '@pooltogether/react-components'
import { msToSeconds } from '@pooltogether/utilities'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useState } from 'react'
import { CountDown } from '../../components/CountDown'
import {
  EmptyProposalsList,
  ErrorLoadingProposalsList,
  LoadingProposalsList,
  ProposalItemContainer,
  ProposalListContainer
} from '../../components/Proposals/ProposalsList'
import { POOLPOOL_SNAPSHOT_URL } from '../../constants'
import { useSnapshotProposals } from '../../hooks/useSnapshotProposals'

export const SnapshotProposalsList = (props) => {
  const { data: proposals, isFetched, error } = useSnapshotProposals()

  if (error) {
    return <ErrorLoadingProposalsList />
  }

  if (!isFetched) {
    return <LoadingProposalsList />
  }

  if (proposals.length === 0) {
    return <EmptyProposalsList />
  }

  return (
    <ProposalListContainer>
      {proposals.map((p) => (
        <SnapshotProposalItem key={p.id} proposal={p} />
      ))}
    </ProposalListContainer>
  )
}

const SnapshotProposalItem = (props) => {
  const { t } = useTranslation()
  const { proposal } = props
  const { title, end, id } = proposal

  return (
    <ProposalItemContainer>
      <div className='flex justify-between flex-col-reverse sm:flex-row'>
        <div>
          <h6 className='leading-none mb-2 mt-2 sm:mt-0 break-words'>{title}</h6>
        </div>
        <SnapshotProposalCountDown end={end} />
      </div>
      <Link href={`${POOLPOOL_SNAPSHOT_URL}/proposal/${id}`}>
        <ButtonLink target='_blank' rel='noopener noreferrer'>
          {t('voteNow')}
        </ButtonLink>
      </Link>
    </ProposalItemContainer>
  )
}

const SnapshotProposalCountDown = (props) => {
  const { end } = props

  const [seconds] = useState(end - msToSeconds(Date.now()))

  return <CountDown className='sm:ml-auto sm:w-unset mb-4 sm:mb-0' seconds={seconds} />
}
