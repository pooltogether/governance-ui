import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import React from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import { AppContainer } from '../components/AppContainer'

// CSS
import '@styles/index.css'
import '@styles/bottomSheet.css'
import '@styles/proposalDescription.css'
import '@pooltogether/react-components/dist/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-spring-bottom-sheet/dist/style.css'

const App = (props: AppProps) => {
  return <AppContainer {...props} />
}

export default appWithTranslation(App, nextI18NextConfig)
