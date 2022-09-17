import React from 'react'
import { ethers } from 'ethers'
import classnames from 'classnames'
import { useTranslation } from 'next-i18next'
import {
  SquareButton,
  ExternalLink,
  PageTitleAndBreadcrumbs,
  SquareButtonSize
} from '@pooltogether/react-components'
import { DEFAULT_TOKEN_PRECISION } from '../../constants'
import { Banner } from '../../components/Banner'
import { ProposalCreationForm } from '../../components/ProposalCreation/ProposalCreationForm'
import { useGovernorAlpha } from '../../hooks/useGovernorAlpha'
import { useUserCanCreateProposal } from '../../hooks/useUserCanCreateProposal'
import Link from 'next/link'
import { useConnectWallet, useUsersAddress } from '@pooltogether/wallet-connection'
import { numberWithCommas } from '@pooltogether/utilities'

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
  const connectWallet = useConnectWallet()
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
        <SquareButton
          type='button'
          className='mx-auto mt-4 xs:w-5/12 sm:w-1/3 lg:w-1/4'
          size={SquareButtonSize.sm}
          onClick={() => connectWallet()}
        >
          {t('connectWallet')}
        </SquareButton>
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
