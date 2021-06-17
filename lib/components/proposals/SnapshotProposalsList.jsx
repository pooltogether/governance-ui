import { ButtonLink, Card, LoadingDots } from '@pooltogether/react-components'
import { CountDown } from 'lib/components/CountDown'
import {
  ErrorLoadingProposalsList,
  LoadingProposalsList,
  ProposalItemContainer,
  ProposalListContainer
} from 'lib/components/Proposals/ProposalsList'
import { POOLPOOL_SNAPSHOT_URL } from 'lib/constants'
import { useSnapshotProposals } from 'lib/hooks/useSnapshotProposals'
import { msToSeconds } from 'lib/utils/msToSeconds'
import Link from 'next/link'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const SnapshotProposalsList = (props) => {
  const { data: proposals, isFetched, error } = useSnapshotProposals()

  if (error) {
    return <ErrorLoadingProposalsList />
  }

  if (!isFetched) {
    return <LoadingProposalsList />
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
          <h6 className='leading-none mb-2 mt-2 sm:mt-0'>{title}</h6>
        </div>
        <SnapshotProposalCountDown end={end} />
      </div>
      <ButtonLink
        Link={Link}
        href={`${POOLPOOL_SNAPSHOT_URL}/proposal/${id}`}
        border='green'
        text='primary'
        bg='green'
        hoverBorder='green'
        hoverText='primary'
        hoverBg='green'
      >
        {t('voteNow')}
      </ButtonLink>
    </ProposalItemContainer>
  )
}

const SnapshotProposalCountDown = (props) => {
  const { end } = props

  const [seconds] = useState(end - msToSeconds(Date.now()).toNumber())

  return <CountDown className='sm:ml-auto sm:w-unset mb-4 sm:mb-0' seconds={seconds} />
}
