import React, { useLayoutEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

import { Trans, useTranslation } from 'react-i18next'
import { AddGovernanceTokenToMetaMask } from 'lib/components/AddGovernanceTokenToMetaMask'
import { ProposalsList } from 'lib/components/proposals/ProposalsList'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { UsersPoolVotesCard } from 'lib/components/UsersPoolVotesCard'
import { useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'
import { ButtonLink, Card, ExternalLink, LoadingDots } from '@pooltogether/react-components'
import {
  DISCORD_INVITE_URL,
  POOLPOOL_SNAPSHOT_URL,
  POOLPOOL_URL,
  POOLTOGETHER_GOV_FORUM_URL,
  POOLTOGETHER_SNAPSHOT_URL
} from 'lib/constants'
import Link from 'next/link'

export const ProposalsUI = (props) => {
  const { t } = useTranslation()

  const { isFetched } = useAllProposalsSorted()

  if (!isFetched) {
    return (
      <div className='flex flex-grow'>
        <LoadingDots className='m-auto' />
      </div>
    )
  }

  return (
    <>
      <RetroactivePoolClaimBanner />

      <UsersPoolVotesCard />

      <div className='my-12'>
        <div className='flex flex-col sm:flex-row mb-8'>
          <div className='sm:w-2/3'>
            <h1 className='text-inverse'>{t('pooltogetherGovernance')}</h1>

            <p className='text-inverse mb-8 sm:mb-0'>
              {t('theProtocolIsControlledByDecentralizedGovernance')}
              <ExternalLink underline className='ml-1' href='https://medium.com/p/23b09f36db48'>
                {t('readMoreAboutPoolTogetherGovernance')}
              </ExternalLink>
            </p>
          </div>
          <div className='mx-4 sm:ml-4 sm:w-1/3 flex flex-col justify-center'>
            <ButtonLink
              Link={Link}
              as={`/proposals/create`}
              href={`/proposals/create`}
              disabled
              textSize='xxs'
              className='w-full mb-4'
              tertiary
            >
              {t('createAProposal')}
            </ButtonLink>
          </div>
        </div>

        <h3 className='mb-4 text-lg'>{t('lookingToGetInvolved')}</h3>

        <div className='flex flex-col sm:flex-row mb-8 sm:mb-16'>
          <Card className='w-full sm:w-1/2 mb-4 sm:mb-0 sm:mr-4'>
            <h6 className='mb-2'>{t('joinTheDiscussion')}</h6>
            <p>
              <Trans
                i18nKey='checkoutTheForumAndDiscord'
                defaults='Check out our <linkToForum>forum</linkToForum> and our <linkToDiscord>Discord</linkToDiscord> to stay up to date.'
                components={{
                  linkToForum: <ExternalLink underline href={POOLTOGETHER_GOV_FORUM_URL} />,
                  linkToDiscord: <ExternalLink underline href={DISCORD_INVITE_URL} />
                }}
              />
            </p>
          </Card>
          <Card className='w-full sm:w-1/2 sm:ml-4'>
            <h6 className='mb-2'>{t('wantToVoteGasFree')}</h6>
            <p>
              <Trans
                i18nKey='depositIntoPoolPoolToVoteGasFree'
                defaults='Deposit into the <poolPoolLink>POOL Pool</poolPoolLink> to vote without transaction fees on <snapshotLink>Snapshot</snapshotLink>.'
                components={{
                  poolPoolLink: <ExternalLink underline href={POOLPOOL_URL} />,
                  snapshotLink: <ExternalLink underline href={POOLPOOL_SNAPSHOT_URL} />
                }}
              />
            </p>
          </Card>
        </div>
      </div>

      <ProposalsList />

      <AddGovernanceTokenToMetaMask />
    </>
  )
}
