import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider, useTheme } from 'next-themes'
import { createClient, useAccount, useConnect, WagmiConfig } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ScreenSize, useScreenSize, LoadingScreen } from '@pooltogether/react-components'
import { useInitCookieOptions, getAppEnvString } from '@pooltogether/hooks'
import { ToastContainer } from 'react-toastify'
import {
  CHAIN_ID,
  useUpdateStoredPendingTransactions,
  getReadProvider,
  initRpcUrls
} from '@pooltogether/wallet-connection'
import React from 'react'
import { RPC_URLS, SUPPORTED_CHAINS } from '../constants'
import { AppProps } from 'next/app'
import { useTranslation } from 'next-i18next'
import { CustomErrorBoundary } from './CustomErrorBoundary'

// Initialize react-query Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    }
  }
})

// Initialize global RPC URLs for external packages
initRpcUrls(RPC_URLS)

// Initialize WAGMI wallet connectors
const chains = SUPPORTED_CHAINS[getAppEnvString()]
const connectors = () => {
  return [
    new MetaMaskConnector({ chains, options: {} }),
    new WalletConnectConnector({
      chains,
      options: {
        bridge: 'https://pooltogether.bridge.walletconnect.org/',
        qrcode: true
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'PoolTogether'
      }
    }),
    new InjectedConnector({ chains, options: {} })
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider: ({ chainId }) => {
    return getReadProvider(chainId || CHAIN_ID.mainnet)
  }
})

/**
 * AppContainer wraps all pages in the app. Used to set up globals.
 * @param props
 * @returns
 */
export const AppContainer: React.FC<AppProps> = (props) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ThemeProvider attribute='class'>
            <ThemedToastContainer />
            <CustomErrorBoundary>
              <Content {...props} />
            </CustomErrorBoundary>
          </ThemeProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </WagmiConfig>
  )
}

const Content: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props
  const isInitialized = useInitialLoad()

  if (!isInitialized) {
    return <LoadingScreen />
  }
  return <Component {...pageProps} />
}

const useInitialLoad = () => {
  const { i18n } = useTranslation()
  useUpdateStoredPendingTransactions()
  useInitCookieOptions(process.env.NEXT_PUBLIC_DOMAIN_NAME)
  const { status } = useAccount()
  return !!i18n.isInitialized && status !== 'reconnecting' && status !== 'connecting'
}

const ThemedToastContainer = (props) => {
  const { theme, systemTheme } = useTheme()
  const screenSize = useScreenSize()
  return (
    <ToastContainer
      {...props}
      style={{ zIndex: '99999' }}
      position={screenSize > ScreenSize.sm ? 'bottom-right' : 'top-center'}
      autoClose={7000}
      theme={theme === 'system' ? systemTheme : (theme as 'dark' | 'light')}
    />
  )
}
