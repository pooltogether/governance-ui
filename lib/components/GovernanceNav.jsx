import { ButtonLink } from '@pooltogether/react-components'
import Link from 'next/link'
import React from 'react'

export const GovernanceNav = (props) => {
  return (
    <div className='flex flex-row mb-8'>
      <ButtonLink Link={Link} href='/proposals' className='mr-8'>
        Proposals
      </ButtonLink>
      <ButtonLink Link={Link} href='/delegates'>
        Delegates
      </ButtonLink>
    </div>
  )
}
