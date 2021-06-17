import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { DateTime } from 'luxon'
import { Card, ButtonLink, ExternalLink, LoadingDots } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

import { PROPOSAL_STATUS } from 'lib/constants'
import { CountDown } from 'lib/components/CountDown'
import { SORTED_STATES, useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'
import { useProposalData } from 'lib/hooks/useProposalData'
import { msToSeconds } from 'lib/utils/msToSeconds'

import ChatBubble from 'assets/images/chat-bubble.svg'
import Link from 'next/link'

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
    <p>There was an error loading proposals, please try again later.</p>
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
        'ml-auto text-white sm:ml-0 mb-2 sm:mb-0 flex rounded px-2 py-1 w-fit-content h-fit-content bg-tertiary whitespace-no-wrap',
        {
          'text-orange': statusValue < 0,
          'text-highlight-9': statusValue > 0,
          'text-inverse': statusValue === 0
        }
      )}
    >
      {proposal.endDate && (
        <div className='pl-2 sm:pl-4 mr-2 sm:mr-4 text-right' style={{ minWidth: 104 }}>
          {proposal.endDate.toLocaleString(DateTime.DATE_MED)}
        </div>
      )}
      {icon && showIcon && (
        <FeatherIcon icon={icon} className='my-auto mr-2 stroke-current w-4 h-4' />
      )}
      <div className='pr-2 sm:pr-4 font-bold capitalized'>{t(status)}</div>
    </div>
  )
}

const ProposalCountDown = (props) => {
  const { proposal } = props

  const [seconds] = useState(proposal.endDateSeconds - msToSeconds(Date.now()).toNumber())
  const { refetch } = useProposalData(proposal.id)

  return (
    <CountDown className='sm:ml-auto sm:w-unset mb-4 sm:mb-0' seconds={seconds} onZero={refetch} />
  )
}

const ViewProposalButton = (props) => {
  const { proposal } = props

  const { t } = useTranslation()
  const { status, id } = proposal

  if (status === PROPOSAL_STATUS.active) {
    return (
      <ButtonLink
        Link={Link}
        href={'/proposals/[id]/'}
        as={`/proposals/${id}/`}
        border='green'
        text='primary'
        bg='green'
        hoverBorder='green'
        hoverText='primary'
        hoverBg='green'
      >
        {t('voteNow')}
      </ButtonLink>
    )
  }

  return (
    <ButtonLink Link={Link} textSize='xxs' href={'/proposals/[id]/'} as={`/proposals/${id}/`}>
      {t('viewProposal')}
    </ButtonLink>
  )
}

export const EmptyProposalsList = () => {
  const { t } = useTranslation()

  return (
    <Card className='mb-6'>
      <div className='mx-auto py-4 px-8 sm:py-8 sm:px-10 bg-body rounded-xl flex flex-col text-center text-inverse'>
        <img src={ChatBubble} className='mx-auto w-16 h-16 sm:w-auto sm:h-auto mb-4 sm:mb-6' />
        <h4 className='mb-2'>{t('noActiveProposalsAtTheMoment')}</h4>
        <p>
          {t('weEncourageYouToDiscussAnyIdeasYouHaveOn')}{' '}
          <ExternalLink
            underline
            className='text-inverse'
            href='https://discord.gg/hxPhPDW'
            title='Discord'
          >
            Discord
          </ExternalLink>{' '}
          {t('and')}{' '}
          <ExternalLink
            underline
            className='text-inverse'
            href='https://gov.pooltogether.com/'
            title='Discourse'
          >
            Discourse
          </ExternalLink>
          .
        </p>
      </div>
    </Card>
  )
}
