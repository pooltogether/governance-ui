import Layout from 'lib/components/Layout'
import { ProposalsUI } from 'lib/components/ProposalList/ProposalsUI'
import React from 'react'

export default function IndexPage(props) {
  return (
    <Layout>
      <ProposalsUI />
    </Layout>
  )
}
