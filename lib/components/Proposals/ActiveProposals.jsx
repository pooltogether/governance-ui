import React, { useState } from 'react'
import { CommonProposalsList } from 'lib/components/Proposals/ProposalsUI'
import { SnapshotProposals } from 'lib/components/Proposals/SnapshotProposals'
import { ContentPane, Tabs } from '@pooltogether/react-components'
import { useRouter } from 'next/router'
import { queryParamUpdater } from '@pooltogether/utilities'

export const ActiveProposals = (props) => {
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
      <Tabs className='justify-between sm:justify-start sticky bg-body top-20 pt-4 sm:pt-16 mb-2 pb-4'>
        {TABS.map((tab) => (
          <tab.tabView key={tab.id} tab={tab} currentTab={currentTab} setTab={setTab} />
        ))}
      </Tabs>
      )
      {TABS.map((tab) => (
        <ContentPane key={tab.id} isSelected={tab.id === currentTab}>
          <tab.view tab={tab} />
        </ContentPane>
      ))}
    </>
  )

  return (
    <>
      <SectionTitle id='onchain'>POOL Proposals</SectionTitle>
      <CommonProposalsList {...props} />
      <SectionTitle>pPOOL Proposals</SectionTitle>
      <SnapshotProposals id='offchain' {...props} />
    </>
  )
}

const TABS = {}

const SectionTitle = (props) => (
  <h5 id={props.id} className='font-normal text-accent-2 mb-4'>
    {props.children}
  </h5>
)
