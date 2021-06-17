import { SnapshotProposalsList } from 'lib/components/Proposals/SnapshotProposalsList'
import { PoolIcon, TipBanner, ExternalLink, LinkTheme } from '@pooltogether/react-components'
import React from 'react'
import { POOLPOOL_SNAPSHOT_URL } from 'lib/constants'

export const SnapshotProposals = (props) => {
  return (
    <>
      <SnapshotTip />
      <SnapshotProposalsList />
    </>
  )
}

const SnapshotTip = () => {
  return (
    <TipBanner
      className='mb-6'
      title='Vote gas-free + earn rewards'
      links={[
        <ExternalLink
          key='snapshot_link'
          href={POOLPOOL_SNAPSHOT_URL}
          theme={LinkTheme.accent}
          className='mr-4 text-sm'
        >
          Go to SnapShot
        </ExternalLink>,
        <ExternalLink
          key='knowledge_base_link'
          className='text-sm'
          href='https://www.notion.so/PoolTogether-Knowledge-Base-fa721ccefa3242eaabd125a8415acd27'
          theme={LinkTheme.accent}
        >
          Learn more
        </ExternalLink>
      ]}
    >
      <p className='text-sm'>
        In order to vote on SnapShot, you need to have ptPOOL tokens. You can obtain them by
        depositing your <PoolIcon /> POOL into the{' '}
        <ExternalLink
          className='text-sm'
          href='https://app.pooltogether.com/pools/mainnet/PT-stPOOL'
          theme={LinkTheme.accent}
        >
          POOL Pool
        </ExternalLink>
        . By doing so, you will be eligible to vote gas-free amd jave a chance to win a weekly
        prize.
      </p>
    </TipBanner>
  )
}
