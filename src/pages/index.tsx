import { LoadingScreen } from '@pooltogether/react-components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic.js'
import React from 'react'
import { Suspense } from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import { LandingPage } from '../components/LandingPage'
import { PagePadding } from '../components/Layout/PagePadding'

const Layout = dynamic(() => import('@components/Layout'), {
  suspense: true
})

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], nextI18NextConfig))
    }
  }
}

export default function IndexPage(props) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Layout>
        <PagePadding>
          <LandingPage />
        </PagePadding>
      </Layout>
    </Suspense>
  )
}
