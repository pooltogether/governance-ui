import {
  Button,
  ExternalLink,
  PageTitleAndBreadcrumbs,
  ButtonSize
} from '@pooltogether/react-components'
import { numberWithCommas } from '@pooltogether/utilities'
import { useUsersAddress } from '@pooltogether/wallet-connection'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'
import { Banner } from '../../components/Banner'
import { ProposalCreationForm } from '../../components/ProposalCreation/ProposalCreationForm'
import { DEFAULT_TOKEN_PRECISION } from '../../constants'
import { useGovernorAlpha } from '../../hooks/useGovernorAlpha'
import { useUserCanCreateProposal } from '../../hooks/useUserCanCreateProposal'

export const ProposalCreationUI = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <ProposalCreationMinimumRequirementBanner />

      <div className={classnames('trans mb-12')}>
        <PageTitleAndBreadcrumbs
          Link={Link}
          title={t('createANewProposal')}
          className='mb-10'
          breadcrumbs={[
            {
              href: '/',
              as: '/',
              name: t('vote')
            },
            {
              href: '/',
              as: '/',
              name: t('proposals')
            },
            {
              href: '/proposals/create',
              as: '/proposals/create',
              name: t('createProposal')
            }
          ]}
        />
      </div>

      <ProposalCreationForm />
    </>
  )
}

const ProposalCreationMinimumRequirementBanner = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()
  const { openConnectModal } = useConnectModal()
  const { isFetched, userCanCreateProposal } = useUserCanCreateProposal()
  const { data: governorAlpha } = useGovernorAlpha()

  // TODO: Add links for 'more about token'

  if (!usersAddress) {
    return (
      <Banner
        theme='purplePinkBorder'
        outerClassName='mb-8'
        innerClassName='text-center flex flex-col'
      >
        <h2>🗳</h2>
        <h6>{t('connectAWalletToCreateAProposal')}</h6>
        <ExternalLink
          underline
          href='https://medium.com/pooltogether/governance-101-fca9ab8b8ba2'
          title='Governance 101'
        >
          {t('learnMore')}
        </ExternalLink>
        <Button
          type='button'
          className='mx-auto mt-4 xs:w-5/12 sm:w-1/3 lg:w-1/4'
          size={ButtonSize.sm}
          onClick={openConnectModal}
        >
          {t('connectWallet')}
        </Button>
      </Banner>
    )
  }

  if (!isFetched || userCanCreateProposal) return null

  const proposalThreshold = numberWithCommas(
    ethers.utils.formatUnits(governorAlpha.proposalThreshold, DEFAULT_TOKEN_PRECISION),
    { precision: 0 }
  )

  return (
    <Banner theme='purplePinkBorder' outerClassName='mb-8' innerClassName='text-center'>
      <h2>🗳</h2>
      <h6>{t('inOrderToSubmitAProposalYouNeedDelegatedThreshold', { proposalThreshold })} </h6>
      <ExternalLink
        underline
        href='https://medium.com/pooltogether/governance-101-fca9ab8b8ba2'
        title='Governance 101'
      >
        {t('learnMore')}
      </ExternalLink>
    </Banner>
  )
}
