import { PageTitleAndBreadcrumbs, ButtonLink, Tabs } from '@pooltogether/react-components'
import { Trans, useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'
import { ProposalsList } from '../../components/Proposals/ProposalsList'
import { SnapshotProposals } from '../../components/Proposals/SnapshotProposals'
import { RetroactivePoolClaimBanner } from '../../components/RetroactivePoolClaimBanner'
import { VotingPowerCard } from '../../components/VotingPowerCard'
import { SORTED_STATES } from '../../hooks/useAllProposalsSorted'

export const ProposalsUI = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <div className='flex flex-col sm:flex-row mb-10 sm:justify-between'>
        <PageTitleAndBreadcrumbs
          Link={Link}
          title={t('governance')}
          breadcrumbs={[
            {
              href: '/',
              as: '/',
              name: t('governance')
            },
            {
              name: t('proposals')
            }
          ]}
          sizeClassName=''
          className='mb-4 sm:mb-0'
        />
        <Link href='/proposals/create'>
          <ButtonLink className='w-full sm:w-max h-fit-content'>
            <Trans i18nKey='createANewProposal' />
          </ButtonLink>
        </Link>
      </div>

      <RetroactivePoolClaimBanner />

      <VotingPowerCard className='mb-20' />
      <Tabs
        titleClassName='mb-8'
        tabs={[
          {
            id: 'active',
            title: <Trans i18nKey='active'>Active</Trans>,
            view: <ProposalsList proposalStates={[SORTED_STATES.active, SORTED_STATES.pending]} />
          },
          {
            id: 'off-chain',
            title: <Trans i18nKey='offChain'>Off-chain</Trans>,
            view: <SnapshotProposals />
          },
          {
            id: 'executable',
            title: <Trans i18nKey='executable'>Executable</Trans>,
            view: (
              <ProposalsList proposalStates={[SORTED_STATES.executable, SORTED_STATES.approved]} />
            )
          },
          {
            id: 'past',
            title: <Trans i18nKey='past'>Past</Trans>,
            view: <ProposalsList proposalStates={[SORTED_STATES.past]} />
          }
        ]}
        initialTabId={'active'}
      />
    </>
  )
}
