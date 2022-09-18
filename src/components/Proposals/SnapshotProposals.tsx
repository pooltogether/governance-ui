import { PoolIcon, ExternalLink, LinkTheme } from '@pooltogether/react-components'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'
import { SnapshotProposalsList } from '../../components/Proposals/SnapshotProposalsList'
import { POOLPOOL_SNAPSHOT_URL } from '../../constants'

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
    <div className='mb-6 flex flex-col space-y-2 border p-4 rounded-xl border-gradient-purple bg-white dark:border-pt-purple-light dark:bg-pt-purple-darker'>
      <div className='font-bold text-lg'>{t('voteGasFree', 'Vote gas free')}</div>
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
      <p className='text-sm text-pt-purple-darkest text-opacity-75 dark:text-pt-purple-lightest dark:text-opacity-75'>
        <Trans
          i18nKey='snapshotTip'
          components={{
            PoolIcon: <PoolIcon />,
            PoolPoolLink: (
              <ExternalLink
                className='text-sm'
                href='https://v3.pooltogether.com/pools/mainnet/PT-stPOOL'
                theme={LinkTheme.accent}
                children={undefined}
              />
            )
          }}
        />
      </p>
    </div>
  )
}
