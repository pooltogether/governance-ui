import {
  BottomAccountIcon,
  BottomNavContainer,
  BottomNavLink,
  BottomPoolsIcon,
  BottomPodsIcon,
  BottomRewardsIcon,
  BottomVoteIcon,
  CountBadge
} from '@pooltogether/react-components'
import { useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const BottomNav = (props) => {
  return (
    <BottomNavContainer>
      <BottomNavLink
        href='https://app.pooltogether.com'
        as='https://app.pooltogether.com'
        label={'App'}
        Link={Link}
        useRouter={useRouter}
      >
        <BottomPoolsIcon />
      </BottomNavLink>
      <BottomNavLink
        href='https://app.pooltogether.com/account'
        as='https://app.pooltogether.com/account'
        label={'Account'}
        Link={Link}
        useRouter={useRouter}
      >
        <BottomAccountIcon />
      </BottomNavLink>
      <BottomNavLink href='/' as='/' label={'Vote'} Link={Link} useRouter={useRouter} match='/'>
        <VoteIcon />
      </BottomNavLink>
    </BottomNavContainer>
  )
}

const VoteIcon = () => {
  const { sortedProposals } = useAllProposalsSorted()
  const activeCount = sortedProposals?.active?.length

  return (
    <div className='relative'>
      {activeCount > 0 && (
        <CountBadge className='z-10 absolute -top-2 -right-2' count={activeCount} />
      )}
      <BottomVoteIcon />
    </div>
  )
}
