import { useGovernanceChainId } from '@pooltogether/hooks'
import { ExternalLink } from '@pooltogether/react-components'
import { BlockExplorerLink } from '@pooltogether/wallet-connection'
import classnames from 'classnames'
import React from 'react'
import { useSocialIdentity } from '../hooks/useTwitterProfile'

export const DelegateAddress = (props) => {
  const { address, className, theme } = props
  const delegateIdentity = useSocialIdentity(address)
  const twitterHandle = delegateIdentity?.twitter?.handle

  const chainId = useGovernanceChainId()

  if (twitterHandle) {
    return (
      <>
        <ExternalLink
          theme={theme}
          href={`https://twitter.com/${twitterHandle}`}
          className={classnames('mr-2', className)}
        >
          {twitterHandle}
        </ExternalLink>
        <BlockExplorerLink
          theme={theme}
          chainId={chainId}
          className={classnames(className)}
          address={address}
          shorten
        />
      </>
    )
  }

  return (
    <BlockExplorerLink
      theme={theme}
      chainId={chainId}
      className={classnames('mr-2', className)}
      address={address}
      shorten
    />
  )
}
