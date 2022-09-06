import { SnapshotProposalsList } from '../components/Proposals/SnapshotProposalsList'
import { PoolIcon, TipBanner, ExternalLink, LinkTheme } from '@pooltogether/react-components'
import React from 'react'
import { POOLPOOL_SNAPSHOT_URL } from '../constants'
import { Trans, useTranslation } from 'react-i18next'

export const SnapshotProposals = (props) => {
  return (
    <>
      <SnapshotTip />
      <SnapshotProposalsList />
    </>
  )
}

const SnapshotTip = () => {
  const { t } = useTranslation()
  return (
    <TipBanner
      className='mb-6'
      title={t('voteGasFreeAndEarnRewards')}
      links={[
        <ExternalLink
          key='snapshot_link'
          href={POOLPOOL_SNAPSHOT_URL}
          theme={LinkTheme.accent}
          className='mr-4 text-sm'
        >
          {t('goToSnapshot')}
        </ExternalLink>,
        <ExternalLink
          key='knowledge_base_link'
          className='text-sm'
          href='https://www.notion.so/PoolTogether-Knowledge-Base-fa721ccefa3242eaabd125a8415acd27'
          theme={LinkTheme.accent}
        >
          {t('learnMore')}
        </ExternalLink>
      ]}
    >
      <p className='text-sm'>
        <Trans
          i18nKey='snapshotTip'
          components={{
            PoolIcon: <PoolIcon />,
            PoolPoolLink: (
              <ExternalLink
                className='text-sm'
                href='https://v3.pooltogether.com/pools/mainnet/PT-stPOOL'
                theme={LinkTheme.accent}
              />
            )
          }}
        />
      </p>
    </TipBanner>
  )
}
