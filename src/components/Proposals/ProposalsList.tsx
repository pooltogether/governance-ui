import {
  Card,
  ExternalLink,
  LoadingDots,
  LinkTheme,
  SquareLink
} from '@pooltogether/react-components'
import { msToSeconds } from '@pooltogether/utilities'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { DateTime } from 'luxon'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'
import React, { useState } from 'react'
import { CountDown } from '../../components/CountDown'
import { PROPOSAL_STATUS } from '../../constants'
import { useAllProposalsSorted } from '../../hooks/useAllProposalsSorted'
import { useProposalData } from '../../hooks/useProposalData'

export const ProposalsList = (props) => {
  const { proposalStates } = props
  const { isFetched, sortedProposals, error } = useAllProposalsSorted()

  if (error) {
    return <ErrorLoadingProposalsList />
  }

  if (!isFetched) {
    return <LoadingProposalsList />
  }

  const proposals = []
  proposalStates.forEach((proposalState) => {
    proposals.push(...sortedProposals[proposalState])
  })

  if (proposals.length === 0) {
    return <EmptyProposalsList />
  }

  return (
    <ProposalListContainer>
      {proposals.map((p) => (
        <ProposalItem key={p.id} proposal={p} />
      ))}
    </ProposalListContainer>
  )
}

export const ProposalListContainer = (props) => <ol className='mb-8 sm:mb-16'>{props.children}</ol>

export const LoadingProposalsList = () => (
  <div className='w-full flex flex-col justify-center p-12 sm:p-24 '>
    <LoadingDots className='mx-auto' />
  </div>
)

export const ErrorLoadingProposalsList = () => (
  <div className='w-full flex flex-col justify-center p-12 sm:p-24 text-center'>
    <FeatherIcon icon='alert-triangle' className='w-12 h-12 mb-4 text-orange mx-auto' />
    <p>
      <Trans i18nKey='errorLoadingProposals' />
    </p>
  </div>
)

export const ProposalItemContainer = (props) => (
  <li className='mb-6 last:mb-0'>
    <Card>{props.children}</Card>
  </li>
)

export const ProposalItem = (props) => {
  const { proposal } = props

  const { t } = useTranslation()

  const { title, id } = proposal

  return (
    <ProposalItemContainer>
      <div className='flex justify-between flex-col-reverse sm:flex-row'>
        <div>
          <h6 className='leading-none mb-2 mt-2 sm:mt-0 break-words'>{title}</h6>
          <p className='mb-4'>{t('proposalId', { id })}</p>
        </div>
        <ProposalStatus proposal={proposal} />
      </div>
      <ViewProposalButton proposal={proposal} />
    </ProposalItemContainer>
  )
}

export const ProposalStatus = (props) => {
  const { proposal } = props

  const { t } = useTranslation()
  const { status } = proposal

  let statusValue
  switch (status) {
    case PROPOSAL_STATUS.executed:
    case PROPOSAL_STATUS.succeeded:
    case PROPOSAL_STATUS.active:
    case PROPOSAL_STATUS.queued: {
      statusValue = 1
      break
    }
    case PROPOSAL_STATUS.expired:
    case PROPOSAL_STATUS.defeated:
    case PROPOSAL_STATUS.cancelled: {
      statusValue = -1
      break
    }
    default:
    case PROPOSAL_STATUS.pending: {
      statusValue = 0
      break
    }
  }

  let icon
  if (statusValue < 0) {
    icon = 'x-circle'
  } else if (statusValue > 0) {
    icon = 'check-circle'
  }

  const showIcon = status !== PROPOSAL_STATUS.active && status !== PROPOSAL_STATUS.pending

  if (status === PROPOSAL_STATUS.active) {
    return <ProposalCountDown proposal={proposal} />
  }

  return (
    <div
      className={classnames(
        'sm:ml-auto text-white mb-2 sm:mb-0 flex items-center rounded-lg px-2 py-1 w-fit-content h-fit-content bg-tertiary whitespace-no-wrap',
        {
          'text-orange': statusValue < 0,
          'text-highlight-9': statusValue > 0,
          'text-inverse': statusValue === 0
        }
      )}
    >
      {proposal.endDate && (
        <div className='sm:pl-4 mr-2 sm:mr-4 sm:text-right' style={{ minWidth: 104 }}>
          {proposal.endDate.toLocaleString(DateTime.DATE_MED)}
        </div>
      )}
      {icon && showIcon && (
        <FeatherIcon icon={icon} className='mr-2 stroke-current w-3 h-3 sm:w-4 sm:h-4' />
      )}
      <div className='sm:pr-4 font-bold capitalized'>{t(status)}</div>
    </div>
  )
}

const ProposalCountDown = (props) => {
  const { proposal } = props

  const [seconds] = useState(proposal.endDateSeconds - msToSeconds(Date.now()))
  const { refetch } = useProposalData(proposal.id)

  return <CountDown className='sm:ml-auto sm:w-unset mb-4 sm:mb-0' seconds={seconds} />
}

const ViewProposalButton = (props) => {
  const { proposal } = props

  const { t } = useTranslation()
  const { status, id } = proposal

  if (status === PROPOSAL_STATUS.active) {
    return (
      <Link href={`/proposals/${id}/`}>
        <SquareLink>{t('voteNow')}</SquareLink>
      </Link>
    )
  }

  return (
    <Link href={`/proposals/${id}/`}>
      <SquareLink>{t('viewProposal')}</SquareLink>
    </Link>
  )
}

export const EmptyProposalsList = () => {
  const { t } = useTranslation()

  return (
    <Card className='mb-6'>
      <img src={'/empty-box.png'} className='mx-auto w-16 h-16 sm:w-auto sm:h-auto my-4 sm:my-8' />
      <h4 className='mt-4 mb-2 text-center text-accent-1'>{t('noActiveProposalsAtTheMoment')}</h4>
      <p className='text-center text-accent-1 mb-4 sm:mb-6'>
        <Trans
          i18nKey='discussIdeasOnDiscordOrDiscourse'
          components={{
            LinkToDiscord: (
              <ExternalLink
                theme={LinkTheme.light}
                underline
                href='https://discord.gg/hxPhPDW'
                title='Discord'
                children={undefined}
              />
            ),
            LinkToDiscourse: (
              <ExternalLink
                theme={LinkTheme.light}
                underline
                href='https://gov.pooltogether.com/'
                title='Discourse'
                children={undefined}
              />
            )
          }}
        />
      </p>
    </Card>
  )
}
