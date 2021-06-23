import React, { useState } from 'react'
import classnames from 'classnames'

import { Trans, useTranslation } from 'react-i18next'
import { AddGovernanceTokenToMetaMask } from 'lib/components/AddGovernanceTokenToMetaMask'
import { ProposalsList } from 'lib/components/Proposals/ProposalsList'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { SORTED_STATES, useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'
import {
  ButtonLink,
  ContentPane,
  CountBadge,
  PageTitleAndBreadcrumbs,
  Tab,
  Tabs
} from '@pooltogether/react-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SnapshotProposals } from 'lib/components/Proposals/SnapshotProposals'
import { queryParamUpdater } from '@pooltogether/utilities'
import { useSnapshotProposals } from 'lib/hooks/useSnapshotProposals'
import { VotingPowerCard } from 'lib/components/VotingPowerCard'

export const ProposalsUI = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  const routerView = String(router?.query?.view)
  let defaultView = TABS[0].id
  if (routerView && TABS.find((tab) => tab.id === routerView)) {
    defaultView = routerView
  }

  const [currentTab, setCurrentTab] = useState(defaultView)

  const setTab = (tab) => {
    setCurrentTab(tab)
    queryParamUpdater.add(router, { view: tab })
  }

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
        <ButtonLink
          Link={Link}
          href='/proposals/create'
          as='/proposals/create'
          className='w-full sm:w-max h-fit-content'
          border='transparent'
          text='primary'
          bg='green'
        >
          <Trans i18nKey='createANewProposal' />
        </ButtonLink>
      </div>

      <RetroactivePoolClaimBanner />

      <VotingPowerCard className='mb-4' />

      <Tabs className='justify-between sm:justify-start sticky bg-body top-20 pt-10 sm:pt-16 mb-2 pb-4'>
        {TABS.map((tab) => (
          <tab.tabView key={tab.id} tab={tab} currentTab={currentTab} setTab={setTab} />
        ))}
      </Tabs>

      {TABS.map((tab) => (
        <ContentPane key={tab.id} isSelected={tab.id === currentTab}>
          <tab.view tab={tab} />
        </ContentPane>
      ))}
    </>
  )
}

const CommonTabView = (props) => {
  const { tab } = props

  const { isFetched, sortedProposals } = useAllProposalsSorted()

  let count = 0
  if (isFetched) {
    const proposals = []
    tab.proposalStates.forEach((proposalState) => {
      proposals.push(...sortedProposals[proposalState])
    })
    count = proposals.length
  }

  return <TabView {...props} count={count} />
}

const SnapshotTabView = (props) => {
  const { data: proposals, isFetched, error } = useSnapshotProposals()

  let count = 0
  if (isFetched && !error) {
    count = proposals.length
  }

  return <TabView {...props} count={count} />
}

const TabView = (props) => {
  const { tab, count, currentTab, setTab } = props
  const isSelected = tab.id === currentTab

  return (
    <div className='flex sm:mr-6 lg:mr-8 last:mr-0'>
      <Tab
        key={tab.id}
        isSelected={isSelected}
        className='flex mx-2'
        onClick={() => setTab(tab.id)}
      >
        <div className='flex'>
          {tab.title}
          {count > 0 && (
            <CountBadge
              count={count}
              bgClassName={classnames({
                'bg-blue': !isSelected,
                'bg-highlight-1': isSelected
              })}
              className={classnames('hidden xs:flex ml-2 my-auto', {
                'opacity-50': !isSelected
              })}
              textClassName={isSelected ? 'text-match' : 'text-white'}
            />
          )}
        </div>
      </Tab>
    </div>
  )
}

const CommonProposalsList = (props) => <ProposalsList proposalStates={props.tab.proposalStates} />

const TABS = [
  {
    id: 'active',
    title: <Trans i18nKey='active'>Active</Trans>,
    view: CommonProposalsList,
    tabView: CommonTabView,
    proposalStates: [SORTED_STATES.active, SORTED_STATES.pending]
  },
  {
    id: 'off-chain',
    title: <Trans i18nKey='offChain'>Off-chain</Trans>,
    view: SnapshotProposals,
    tabView: SnapshotTabView
  },
  {
    id: 'executable',
    title: <Trans i18nKey='executable'>Executable</Trans>,
    view: CommonProposalsList,
    tabView: CommonTabView,
    proposalStates: [SORTED_STATES.executable, SORTED_STATES.pending]
  },
  {
    id: 'past',
    title: <Trans i18nKey='past'>Past</Trans>,
    view: CommonProposalsList,
    tabView: CommonTabView,
    proposalStates: [SORTED_STATES.past]
  }
]
