import { useGovernanceChainId, useTokenBalance } from '@pooltogether/hooks'
import {
  Card,
  LoadingDots,
  ButtonSize,
  ButtonLink,
  Tooltip,
  TimeDisplay,
  useCountdown
} from '@pooltogether/react-components'
import { getPrecision, numberWithCommas, POOL_ADDRESSES } from '@pooltogether/utilities'
import { CHAIN_ID, useUsersAddress } from '@pooltogether/wallet-connection'
import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'
import { POOLPOOL_SNAPSHOT_URL, POOLPOOL_URL } from '../../constants'
import { usePoolPoolProposal } from '../../hooks/usePoolPoolProposal'
import { getSecondsSinceEpoch } from '../../utils/getCurrentSecondsSinceEpoch'
import { getPoolPoolSnapshotId } from '../../utils/getPoolPoolSnapshotId'

const POOLPOOL_PROPOSAL_STATES = Object.freeze({
  active: 'active',
  closed: 'closed'
})

export const PoolPoolProposalCard = (props) => {
  const { proposal, snapshotBlockNumber } = props
  const { id } = proposal
  const { t } = useTranslation()
  const usersAddress = useUsersAddress()
  const chainId = useGovernanceChainId()
  const poolPoolSnapShotId = getPoolPoolSnapshotId(chainId, id)
  const { data: poolPoolProposal, isFetched: isFetched } = usePoolPoolProposal(chainId, id)
  const { isFetched: poolPoolBalanceIsFetched, data: poolPoolBalance } = useTokenBalance(
    CHAIN_ID.mainnet,
    usersAddress,
    POOL_ADDRESSES[CHAIN_ID.mainnet].ppool
  )

  if (!poolPoolSnapShotId) {
    return null
  } else if (!isFetched || !poolPoolBalanceIsFetched) {
    return (
      <Card className='mb-6'>
        <LoadingDots />
      </Card>
    )
  }

  const { state, end } = poolPoolProposal.proposal

  const votingPower = numberWithCommas(poolPoolBalance.amount, {
    precision: getPrecision(poolPoolBalance.amount)
  })

  return (
    <Card className='flex flex-col xs:flex-row xs:justify-between mb-6'>
      <div className='flex flex-col'>
        <span className='flex'>
          <img src={'pool-icon.svg'} className='rounded-full w-4 h-4 xs:w-6 xs:h-6 my-auto mr-2' />
          <h6>{t('poolPoolGasFreeVote')}</h6>
          <Tooltip className='my-auto ml-2 text-inverse' tip={t('depositIntoPoolPoolTooltip')} />
        </span>

        {poolPoolBalanceIsFetched && poolPoolBalance && poolPoolBalance.hasBalance && (
          <span className='text-accent-1 mt-2'>
            <span className='mr-2'>{t('myPoolPoolVotingPower')}</span>
            <b>{votingPower}</b>
          </span>
        )}
        <SnapshotVoteTime end={end} />
      </div>
      <div className='mt-4 xs:mt-0 flex flex-col'>
        <div className='mb-4 flex rounded-lg px-4 py-1 w-fit-content h-fit-content bg-tertiary font-bold'>
          <FeatherIcon icon='alert-circle' className='mr-2 my-auto w-4 h-4' />
          {t('votingPowerIsLockedFromBlock', { blockNumber: snapshotBlockNumber })}
        </div>
        <div className='flex flex-row xs:flex-col'>
          <PoolPoolSnapshotLinkButton state={state} snapShotId={poolPoolSnapShotId} />
          <Link href={POOLPOOL_URL}>
            <ButtonLink
              rel='noopener noreferrer'
              target='_blank'
              size={ButtonSize.sm}
              className='flex justify-center'
            >
              <span className='my-auto'>{t('goToPoolPool')}</span>
              <FeatherIcon
                icon={'external-link'}
                className='relative w-4 h-4 inline-block my-auto ml-2'
              />
            </ButtonLink>
          </Link>
        </div>
      </div>
    </Card>
  )
}

const SnapshotVoteTime = (props) => {
  const { end } = props
  const { t } = useTranslation()
  const { days, hours, minutes, seconds } = useCountdown(end)

  if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
    return (
      <span className='flex text-accent-1'>
        <span className='mt-auto'>{t('justEndsIn')} </span>
        <TimeDisplay days={days} hours={hours} minutes={minutes} seconds={seconds} />
      </span>
    )
  }

  const endDate = new Date(end * 1000)
  return (
    <span className='text-accent-1 my-2'>
      {t('endedOn')} {`${endDate.toLocaleString()}`}
    </span>
  )
}

const PoolPoolSnapshotLinkButton = (props) => {
  const { snapShotId, state } = props
  const { t } = useTranslation()

  return (
    <Link href={`${POOLPOOL_SNAPSHOT_URL}/proposal/${snapShotId}`}>
      <ButtonLink
        target='_blank'
        rel='noopener noreferrer'
        size={ButtonSize.sm}
        className='flex xs:mb-2 justify-center'
      >
        <span className='my-auto'>
          {state === POOLPOOL_PROPOSAL_STATES.closed ? 'View on Snapshot' : t('voteOnSnapshot')}
        </span>
        <FeatherIcon
          icon={'external-link'}
          className='relative w-4 h-4 inline-block my-auto ml-2'
        />
      </ButtonLink>
    </Link>
  )
}
