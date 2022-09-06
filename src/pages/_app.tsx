import React from 'react'

// Styles must be imported in _app
import '../styles/index.css'
import '../styles/bottomSheet.css'
import '../styles/proposalDescription.css'
import '@pooltogether/react-components/dist/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-spring-bottom-sheet/dist/style.css'

import { AppContainer } from '../components/AppContainer'

function MyApp({ Component, pageProps }) {
  return (
    <AppContainer>
      <Component {...pageProps} />
    </AppContainer>
  )
}

export default MyApp
