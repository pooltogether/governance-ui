import React, { useState } from 'react'
import classnames from 'classnames'

import { useTranslation } from 'react-i18next'
import { AddGovernanceTokenToMetaMask } from 'lib/components/AddGovernanceTokenToMetaMask'
import { ProposalsList } from 'lib/components/Proposals/ProposalsList'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { UsersPoolVotesCard } from 'lib/components/UsersPoolVotesCard'
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
import { ScreenSize, useScreenSize } from '@pooltogether/hooks'
import { useSnapshotProposals } from 'lib/hooks/useSnapshotProposals'

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
          href='/proposals'
          as='/proposals'
          className='w-full sm:w-max h-fit-content'
        >
          Create a new proposal
        </ButtonLink>
      </div>

      <RetroactivePoolClaimBanner />

      <UsersPoolVotesCard />

      <Tabs className='justify-between sticky bg-body top-20 pt-8 mb-8 z-10 pb-4'>
        {TABS.map((tab) => (
          <tab.tabView key={tab.id} tab={tab} currentTab={currentTab} setTab={setTab} />
        ))}
      </Tabs>

      {TABS.map((tab) => (
        <ContentPane key={tab.id} isSelected={tab.id === currentTab}>
          <tab.view tab={tab} />
        </ContentPane>
      ))}

      <AddGovernanceTokenToMetaMask />
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

  console.log('error', error)

  let count = 0
  if (isFetched && !error) {
    count = proposals.length
  }

  return <TabView {...props} count={count} />
}

const TabView = (props) => {
  const { tab, count, currentTab, setTab } = props
  const screenSize = useScreenSize()
  const isSelected = tab.id === currentTab

  return (
    <div className='flex'>
      <Tab
        key={tab.id}
        isSelected={isSelected}
        className='flex mx-2'
        textClassName='text-xs lg:text-lg'
        onClick={() => setTab(tab.id)}
      >
        {tab.id}
        <span className='hidden sm:block sm:ml-2'>proposals</span>
      </Tab>
      {count > 0 && screenSize > ScreenSize.sm && (
        <CountBadge
          count={count}
          bgClassName='bg-highlight-1'
          className={classnames('ml-1 lg:ml-2 lg:mt-1', {
            'opacity-50': !isSelected
          })}
          textClassName={isSelected ? 'text-darkened' : 'text-white'}
        />
      )}
    </div>
  )
}

const CommonProposalsList = (props) => <ProposalsList proposalStates={props.tab.proposalStates} />

const TABS = [
  {
    id: 'active',
    view: CommonProposalsList,
    tabView: CommonTabView,
    proposalStates: [SORTED_STATES.active, SORTED_STATES.pending]
  },
  { id: 'snapshot', view: SnapshotProposals, tabView: SnapshotTabView },
  {
    id: 'executable',
    view: CommonProposalsList,
    tabView: CommonTabView,
    proposalStates: [SORTED_STATES.executable, SORTED_STATES.pending]
  },
  {
    id: 'past',
    view: CommonProposalsList,
    tabView: CommonTabView,
    proposalStates: [SORTED_STATES.past]
  }
]
