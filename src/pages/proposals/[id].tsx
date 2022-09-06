import Layout from '../../components/Layout'
import { ProposalUI } from '../../components/Proposal/ProposalUI'
import React from 'react'
import { PagePadding } from '../../components/Layout/PagePadding'

export default function IndexPage(props) {
  return (
    <Layout>
      <PagePadding>
        <ProposalUI />
      </PagePadding>
    </Layout>
  )
}
