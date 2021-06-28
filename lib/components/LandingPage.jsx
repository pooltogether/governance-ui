import {
  ButtonLink,
  Card,
  ExternalLink,
  InternalLink,
  LinkTheme,
  PageTitleAndBreadcrumbs
} from '@pooltogether/react-components'
import Link from 'next/link'
import classnames from 'classnames'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import ChatBubble from 'assets/images/LandingPage/chat-bubble.png'
import DollarBill from 'assets/images/LandingPage/dollar-bill.png'
import VoteIcon from 'assets/images/LandingPage/vote-icon.png'
import { DISCORD_INVITE_URL, POOLTOGETHER_GOV_FORUM_URL } from 'lib/constants'

export const LandingPage = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <div className='flex flex-col sm:flex-row mb-10 sm:justify-between'>
        <PageTitleAndBreadcrumbs
          Link={Link}
          title={t('governance')}
          breadcrumbs={[]}
          sizeClassName=''
          className='mb-4 sm:mb-0'
        />
        <ButtonLink
          Link={Link}
          href='/proposals'
          as='/proposals'
          className='w-full sm:w-max'
          border='transparent'
          text='primary'
          bg='green'
        >
          <Trans i18nKey='goToGovernanceDashboard'>Go to Governance Dashboard</Trans>
        </ButtonLink>
      </div>

      <Header>
        <Trans i18nKey='newToPoolTogether'>New to PoolTogether?</Trans>
      </Header>
      <Description>
        <Trans i18nKey='newToPoolTogetherDescription'>
          The best and fastest way to get yourself up to date with the current governance debates is
          to join the discussion with the community.
        </Trans>
      </Description>

      <InfoCard
        src={ChatBubble}
        header={t('joinTheDiscussion')}
        description={t('stayUpToDate')}
        className='sm:mr-4 mb-8'
        links={
          <span className='text-sm text-accent-1'>
            <Trans
              i18nKey='visitOurForumOrGovernance'
              components={{
                LinkToForum: (
                  <CardExternalLink
                    href={POOLTOGETHER_GOV_FORUM_URL}
                    title='PoolTogether Governance Forum'
                  />
                ),
                LinkToDiscord: (
                  <CardExternalLink
                    href={DISCORD_INVITE_URL}
                    title='PoolTogether Community Discord'
                  />
                )
              }}
            />
          </span>
        }
      />

      <Header>
        <Trans i18nKey='imReadyToVote'>I’m ready to vote!</Trans>
      </Header>
      <Description>
        <Trans i18nKey='imReadyToVoteDescription'>Vote on current proposals below.</Trans>
      </Description>

      <div className='w-full flex flex-col sm:flex-row'>
        <InfoCard
          src={VoteIcon}
          header={t('voteOnActiveProposals')}
          description={t('voteWithPoolDescription')}
          className='mb-4 sm:mb-0 sm:mr-4'
          links={
            <InternalLink
              Link={Link}
              as='/proposals?view=active'
              href='/proposals?view=active'
              theme={LinkTheme.accent}
              className='text-sm'
            >
              <Trans i18nKey='voteWithPool'>Vote with POOL</Trans>
            </InternalLink>
          }
        />

        <InfoCard
          src={DollarBill}
          header={t('voteGasFreeAndEarnRewards')}
          description={t('ppoolHoldersCanVoteGasFree')}
          className='sm:ml-4'
          links={
            <InternalLink
              Link={Link}
              as='/proposals?view=active'
              href='/proposals?view=off-chain'
              theme={LinkTheme.accent}
              className='text-sm'
            >
              <Trans i18nKey='voteWithPPool'>Vote with pPOOL</Trans>
            </InternalLink>
          }
        />
      </div>
    </>
  )
}

const InfoCard = (props) => (
  <Card
    sizeClassName='w-full sm:w-auto sm:w-1/2 flex flex-col text-center'
    className={props.className}
  >
    <Icon src={props.src} />
    <CardHeader>{props.header}</CardHeader>
    <CardDescription>{props.description}</CardDescription>
    <div className='mt-auto'>{props.links}</div>
  </Card>
)

const Header = (props) => <h4 className='text-accent-1 mb-4'>{props.children}</h4>
const Description = (props) => (
  <p className='text-accent-1 mb-6 text-sm sm:max-w-3/4'>{props.children}</p>
)

const CardHeader = (props) => <h5 className='mx-auto'>{props.children}</h5>
const CardDescription = (props) => (
  <p className='mt-4 mb-6 text-sm mx-auto text-accent-1'>{props.children}</p>
)
const CardExternalLink = (props) => (
  <ExternalLink href={props.href} title={props.title} theme={LinkTheme.accent} className='text-sm'>
    {props.children}
  </ExternalLink>
)

const Icon = (props) => (
  <div className='h-16 mb-6 mx-auto flex flex-col justify-center'>
    <img src={props.src} className='w-16' />
  </div>
)
