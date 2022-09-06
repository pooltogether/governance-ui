import React from 'react'

// Styles must be imported in _app
import '@pooltogether/react-components/dist/globals.css'
import '@reach/dialog/styles.css'
import '@reach/menu-button/styles.css'
import '@reach/tooltip/styles.css'

import '../assets/styles/index.css'
import '../assets/styles/proposalDescription.css'
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
