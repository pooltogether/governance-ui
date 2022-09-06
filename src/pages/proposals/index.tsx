import Layout from '../../components/Layout'
import { ProposalsUI } from '../../components/Proposals/ProposalsUI'
import React from 'react'
import { PagePadding } from '../../components/Layout/PagePadding'

export default function IndexPage(props) {
  return (
    <Layout>
      <PagePadding>
        <ProposalsUI />
      </PagePadding>
    </Layout>
  )
}
