import React from 'react'
import Link from 'next/link'
import { Trans, useTranslation } from 'react-i18next'
import { useOnboard } from '@pooltogether/hooks'
import FeatherIcon from 'feather-icons-react'
import {
  Card,
  CardTheme,
  ExternalLink,
  LinkTheme,
  PoolIcon,
  Tooltip,
  ThemedClipSpinner,
  ButtonLink
} from '@pooltogether/react-components'
import { getMinPrecision, numberWithCommas } from '@pooltogether/utilities'
import classnames from 'classnames'

import { useTokenHolder } from 'lib/hooks/useTokenHolder'
import { usePoolPoolBalance } from 'lib/hooks/usePoolPoolBalance'
import { POOLPOOL_SNAPSHOT_URL, POOLPOOL_URL } from 'lib/constants'
import { DelegateAddress } from 'lib/components/DelegateAddress'

import VoteIcon from 'assets/images/icon-vote@2x.png'

export const VotingPowerCard = (props) => {
  const { className, blockNumber, snapshotBlockNumber } = props

  const { isWalletConnected } = useOnboard()
  const { t } = useTranslation()

  const { address: usersAddress } = useOnboard()
  const { isFetched: tokenHolderIsFetched, data: tokenHolder } = useTokenHolder(
    usersAddress,
    blockNumber
  )
  const { isFetched: poolPoolBalanceIsFetched, data: poolPoolBalance } = usePoolPoolBalance(
    usersAddress,
    snapshotBlockNumber
  )

  if (!isWalletConnected) {
    return null
  }

  if (
    tokenHolderIsFetched &&
    poolPoolBalanceIsFetched &&
    !poolPoolBalance.hasBalance &&
    !tokenHolder.hasBalance &&
    !tokenHolder.isBeingDelegatedTo &&
    !tokenHolder.isDelegating
  ) {
    return <ZeroBalanceVotingPowerCard className={className} blockNumber={blockNumber} />
  }

  return (
    <Card theme={CardTheme.purple} className={classnames(className, 'relative')}>
      {blockNumber && (
        <div className='mb-4 flex rounded-lg px-4 py-1 w-fit-content h-fit-content bg-tertiary font-bold'>
          <FeatherIcon icon='alert-circle' className='mr-2 my-auto w-4 h-4' />
          {t('votingPowerIsLockedFromBlock', { blockNumber })}
        </div>
      )}

      <div className='flex flex-col sm:flex-row sm:justify-between'>
        <div className='flex flex-col sm:w-1/2 mb-4 sm:mb-0'>
          <LeftTop blockNumber={blockNumber} />
          <LeftBottom />
        </div>

        <div className='flex flex-col sm:w-1/2'>
          <RightTop blockNumber={blockNumber} snapshotBlockNumber={snapshotBlockNumber} />
          <RightBottom snapshotBlockNumber={snapshotBlockNumber} />
        </div>
      </div>

      {(!tokenHolderIsFetched || !poolPoolBalanceIsFetched) && (
        <ThemedClipSpinner className='absolute bottom-4 right-4' />
      )}
    </Card>
  )
}

// Logic Components

const LeftTop = (props) => {
  const { blockNumber } = props

  const { address: usersAddress } = useOnboard()
  const { data: tokenHolder, isFetched: tokenHolderIsFetched } = useTokenHolder(
    usersAddress,
    blockNumber
  )

  let votes = null
  let disabled = true

  let onChainVotesKey = 'onChainVotesTitle'
  if (tokenHolderIsFetched) {
    const { tokenBalance, isDelegating, isBeingDelegatedTo, delegatedVotes } = tokenHolder
    if (isBeingDelegatedTo && !isDelegating) {
      votes = delegatedVotes
      disabled = false
    } else if (!isBeingDelegatedTo && isDelegating) {
      votes = tokenBalance
      disabled = false
    } else if (!isDelegating) {
      votes = tokenBalance
      disabled = true
      onChainVotesKey = 'onChainVotesIfDelegated'
    } else if (isBeingDelegatedTo) {
      votes = delegatedVotes
      disabled = false
    } else {
      votes = tokenBalance
      disabled = true
    }
  }

  return (
    <div className='flex flex-col leading-tight'>
      <TopText>
        <Trans
          i18nKey={onChainVotesKey}
          components={{ PoolIcon: <PoolIcon className='my-auto mx-1' /> }}
        />
      </TopText>
      <TopVotes votes={votes} disabled={disabled} />
    </div>
  )
}

const RightTop = (props) => {
  const { blockNumber, snapshotBlockNumber } = props
  const { address: usersAddress } = useOnboard()
  const { data: poolPoolData, isFetched } = usePoolPoolBalance(usersAddress, snapshotBlockNumber)

  let votes = null
  let tip =
    blockNumber && !snapshotBlockNumber
      ? 'The SnapShot vote starting block number was not found. Displaying your current PPOOL balance'
      : null
  let disabled = true
  if (isFetched) {
    const { hasBalance, amount } = poolPoolData
    disabled = !hasBalance
    votes = amount
  }

  return (
    <div className='flex flex-col leading-tight pt-4 sm:pt-0 border-t sm:border-0 border-primary'>
      <TopText>
        <Trans i18nKey='offChainVotesTitle' />
      </TopText>
      <TopVotes votes={votes} disabled={disabled} tip={tip} />
    </div>
  )
}

const LeftBottom = (props) => {
  const { blockNumber } = props

  const { address: usersAddress } = useOnboard()
  const { data: tokenHolder, isFetched: tokenHolderIsFetched } = useTokenHolder(
    usersAddress,
    blockNumber
  )
  const { t } = useTranslation()

  if (!tokenHolderIsFetched) return null

  const {
    tokenBalance,
    isDelegating,
    isBeingDelegatedTo,
    hasBalance,
    tokenHoldersRepresentedAmount,
    delegate,
    isSelfDelegated
  } = tokenHolder

  let content

  if (!hasBalance && !isDelegating && !isBeingDelegatedTo) {
    content = (
      <ExternalLink
        theme={LinkTheme.light}
        href='https://app.pooltogether.com'
        title='PoolTogether App'
        className='text-xs'
      >
        {t('getPoolFromDepositingInPools')}
      </ExternalLink>
    )
  } else if (!hasBalance && !isDelegating && isBeingDelegatedTo) {
    content = (
      <Trans
        i18nKey='youAreVotingOnBehalfOfXUsers'
        defaults='You are voting on behalf of <b>{{amount}}</b> PoolTogether users'
        components={{
          b: <b />,
          bold: <b />
        }}
        values={{
          amount: tokenHoldersRepresentedAmount
        }}
      />
    )
  } else if (hasBalance && !isDelegating) {
    content = (
      <Trans
        i18nKey='delegateYourVotesOnSybil'
        components={{
          LinkToSybil: (
            <ExternalLink
              className='text-xs'
              theme={LinkTheme.accent}
              title='Sybil'
              href='https://sybil.org/#/delegates/pool'
            />
          )
        }}
      />
    )
  } else if (!isBeingDelegatedTo && isDelegating) {
    content = (
      <Trans
        i18nKey='youAreDelegatingTo'
        components={{
          User: (
            <DelegateAddress
              theme={LinkTheme.light}
              className='font-bold text-xs'
              address={delegate.id}
            />
          )
        }}
      />
    )
  } else if (isDelegating) {
    if (isSelfDelegated) {
      content = (
        <Trans
          i18nKey='youAreSelfDelegatingXVotes'
          components={{
            Count: (
              <b>{numberWithCommas(tokenBalance, { precision: getMinPrecision(tokenBalance) })}</b>
            )
          }}
        />
      )
    } else {
      content = (
        <Trans
          i18nKey='youAreDelegatingXVotesToY'
          defaults='You are delegating <b>{{amount}}</b> votes to <address></address>'
          components={{
            b: <b />,
            bold: <b />,
            address: <DelegateAddress className='font-bold text-xs' address={delegate.id} />
          }}
          values={{
            amount: numberWithCommas(tokenBalance, { precision: getMinPrecision(tokenBalance) })
          }}
        />
      )
    }
  }

  return <span className='text-xs text-accent-1'>{content}</span>
}

const RightBottom = (props) => {
  const { snapshotBlockNumber } = props
  const { address: usersAddress } = useOnboard()
  const { data: poolPoolData, isFetched } = usePoolPoolBalance(usersAddress, snapshotBlockNumber)

  if (!isFetched) return null

  const { hasBalance } = poolPoolData

  if (hasBalance) {
    return (
      <span className='text-xs text-accent-1'>
        <Trans
          i18nKey='voteOnSnapshotLink'
          components={{
            LinkToSnapshot: (
              <ExternalLink
                href={POOLPOOL_SNAPSHOT_URL}
                theme={LinkTheme.light}
                className='text-xs'
              />
            )
          }}
        />
      </span>
    )
  }

  return (
    <span className='text-xs text-accent-1'>
      <Trans
        i18nKey='depositIntoPoolPoolLink'
        components={{
          LinkToPoolPool: (
            <ExternalLink href={POOLPOOL_URL} theme={LinkTheme.light} className='text-xs' />
          )
        }}
      />
    </span>
  )
}

// View Components

const TopText = (props) => <span className='text-xs text-accent-1 flex'>{props.children}</span>
const TopVotes = (props) => {
  const { t } = useTranslation()
  const { votes, disabled, tip } = props
  return (
    <span className='flex'>
      <span
        className={classnames('text-4xl font-bold text-inverse', {
          'opacity-30': disabled
        })}
      >
        {votes === null
          ? '--'
          : t('numVotes', { num: numberWithCommas(votes, { precision: getMinPrecision(votes) }) })}
      </span>
      {tip && (
        <Tooltip className='ml-2 my-auto' id='pool-pool-alert' tip={tip}>
          <FeatherIcon icon='alert-circle' className='w-5 h-5' />
        </Tooltip>
      )}
    </span>
  )
}

const ZeroBalanceVotingPowerCard = (props) => {
  const { className, blockNumber } = props
  const { t } = useTranslation()

  return (
    <Card theme={CardTheme.purple} className={className}>
      {blockNumber && (
        <div className='mb-4 flex rounded-lg px-4 py-1 w-fit-content h-fit-content bg-tertiary font-bold'>
          <FeatherIcon icon='alert-circle' className='mr-2 my-auto w-4 h-4' />
          {t('votingPowerIsLockedFromBlock', { blockNumber })}
        </div>
      )}

      <div className='flex flex-col sm:flex-row justify-between'>
        <div className='flex flex-row mb-8 sm:mb-0 mt-4 sm:mt-0'>
          <img src={VoteIcon} className='w-12 my-auto pb-2 ml-2 mr-8' />
          <div className='flex flex-col justify-center'>
            <h5 className='leading-none mb-2'>
              <Trans i18nKey='youHaveNoVotes' />
            </h5>
            <p className='text-xxs text-accent-1'>
              <Trans i18nKey='youNeedPoolToParticipate' />
            </p>
          </div>
        </div>
        <ButtonLink
          Link={Link}
          target='_blank'
          rel='nofollow noreferrer'
          href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x0cec1a9154ff802e7934fc916ed7ca50bde6844e&use=V2'
          textSize='xs'
          className='w-full sm:w-max h-fit-content my-auto whitespace-nowrap ml-2'
        >
          <Trans i18nKey='getPoolToGetStarted' />
        </ButtonLink>
      </div>
    </Card>
  )
}
