import { LoadingScreen } from '@pooltogether/react-components'
import dynamic from 'next/dynamic.js'
import React from 'react'
import { Suspense } from 'react'
import { PagePadding } from '../../components/Layout/PagePadding'
import { ProposalUI } from '../../components/Proposal/ProposalUI'

const Layout = dynamic(() => import('@components/Layout'), {
  suspense: true
})

export default function IndexPage(props) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Layout>
        <PagePadding>
          <ProposalUI />
        </PagePadding>
      </Layout>
    </Suspense>
  )
}
