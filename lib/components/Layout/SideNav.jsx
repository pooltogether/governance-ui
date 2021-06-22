import React from 'react'
import {
  SideNavContainer,
  SideNavLink,
  SideAccountIcon,
  SideVoteIcon,
  SidePoolsIcon,
  CountBadge,
  SideRewardsIcon
} from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'

export const SideNav = (props) => {
  const { t } = useTranslation()

  return (
    <SideNavContainer>
      <SideNavLink
        href='https://app.pooltogether.com'
        as='https://app.pooltogether.com'
        label={'Pools'}
        Link={Link}
        useRouter={useRouter}
      >
        <SidePoolsIcon />
      </SideNavLink>
      <SideNavLink
        href='https://app.pooltogether.com/account'
        as='https://app.pooltogether.com/account'
        label={t('account')}
        Link={Link}
        useRouter={useRouter}
      >
        <SideAccountIcon />
      </SideNavLink>
      <SideNavLink
        shallow
        href='https://app.pooltogether.com/rewards'
        as='https://app.pooltogether.com/rewards'
        label={t('rewards')}
        Link={Link}
        useRouter={useRouter}
        match='/rewards'
      >
        <SideRewardsIcon />
      </SideNavLink>
      <SideNavLink
        href='/'
        as='/'
        shallow
        label={t('vote')}
        Link={Link}
        useRouter={useRouter}
        match='/'
      >
        <VoteIcon />
      </SideNavLink>
    </SideNavContainer>
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
      <SideVoteIcon />
    </div>
  )
}
