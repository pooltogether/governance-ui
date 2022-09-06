import { SnapshotProposalsList } from '../../components/Proposals/SnapshotProposalsList'
import { PoolIcon, ExternalLink, LinkTheme } from '@pooltogether/react-components'
import React from 'react'
import { POOLPOOL_SNAPSHOT_URL } from '../../constants'
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
    <div className='mb-6 flex flex-col space-y-2 border border-pt-purple-light'>
      <div>{t('voteGasFreeAndEarnRewards')}</div>
      <div className='flex space-x-2 items-center'>
        <ExternalLink
          key='snapshot_link'
          href={POOLPOOL_SNAPSHOT_URL}
          theme={LinkTheme.accent}
          className='mr-4 text-sm'
        >
          {t('goToSnapshot')}
        </ExternalLink>
        <ExternalLink
          key='knowledge_base_link'
          className='text-sm'
          href='https://www.notion.so/PoolTogether-Knowledge-Base-fa721ccefa3242eaabd125a8415acd27'
          theme={LinkTheme.accent}
        >
          {t('learnMore')}
        </ExternalLink>
      </div>
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
    </div>
  )
}
