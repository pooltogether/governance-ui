import Layout from '../../components/Layout'
import { ProposalCreationUI } from '../../components/ProposalCreation/ProposalCreationUI'
import React from 'react'
import { PagePadding } from '../../components/Layout/PagePadding'

export default function IndexPage(props) {
  return (
    <Layout>
      <PagePadding>
        <ProposalCreationUI />
      </PagePadding>
    </Layout>
  )
}
