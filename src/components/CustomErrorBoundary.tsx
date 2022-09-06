import React from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'

import { ErrorPage } from '../components/ErrorPage'
import { useIsWalletMetamask } from '@pooltogether/hooks'
import { useAccount } from 'wagmi'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }

    return this.props.children
  }
}

export function CustomErrorBoundary(props) {
  const { children } = props
  const { connector } = useAccount()

  if (!process.env.NEXT_JS_SENTRY_DSN) {
    return <ErrorBoundary>{children}</ErrorBoundary>
  } else {
    return (
      <>
        <SentryErrorBoundary
          beforeCapture={(scope) => {
            scope.setTag('web3', connector?.name)

            scope.setContext('wallet', {
              name: connector?.name
            })
          }}
          fallback={({ error, componentStack, resetError }) => <ErrorPage />}
        >
          {children}
        </SentryErrorBoundary>
      </>
    )
  }
}
