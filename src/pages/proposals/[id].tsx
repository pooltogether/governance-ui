import { ProposalUI } from '../../components/Proposal/ProposalUI'
import React from 'react'
import { PagePadding } from '../../components/Layout/PagePadding'
import dynamic from 'next/dynamic.js'
import { Suspense } from 'react'
import { LoadingScreen } from '@pooltogether/react-components'

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
