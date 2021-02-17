import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { useSocialIdentity } from 'lib/hooks/useTwitterProfile'
import { shorten } from 'lib/utils/shorten'

export const DelegateAddress = (props) => {
  const { address, alwaysShorten } = props
  const delegateIdentity = useSocialIdentity(address)
  const twitterHandle = delegateIdentity?.twitter?.handle

  if (twitterHandle) {
    return (
      <>
        <a
          className='text-inverse hover:text-accent-1 mr-2 trans'
          href={`https://twitter.com/${twitterHandle}`}
          target='_blank'
          rel='noopener'
        >
          {twitterHandle}
          <FeatherIcon icon='external-link' className='inline w-4 h-4 mb-1 ml-1' />
        </a>
        (
        <EtherscanAddressLink className='text-inverse hover:text-accent-1' address={address}>
          {shorten(address)}
        </EtherscanAddressLink>
        )
      </>
    )
  }

  if (alwaysShorten) {
    return (
      <EtherscanAddressLink className='text-inverse hover:text-accent-1' address={address}>
        <span className='inline'>{shorten(address)}</span>
      </EtherscanAddressLink>
    )
  }

  return (
    <EtherscanAddressLink className='text-inverse hover:text-accent-1' address={address}>
      <span className='hidden sm:inline'>{address}</span>
      <span className='inline sm:hidden'>{shorten(address)}</span>
    </EtherscanAddressLink>
  )
}
