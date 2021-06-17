import {
  ButtonLink,
  Card,
  ExternalLink,
  PageTitleAndBreadcrumbs
} from '@pooltogether/react-components'
import Link from 'next/link'
import classnames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
        <ButtonLink Link={Link} href='/proposals' as='/proposals' className='w-full sm:w-max'>
          Go to Governance Dashboard
        </ButtonLink>
      </div>

      <Header>New to PoolTogether?</Header>
      <Description>
        The best and fastest way to get yourself up to date with the current governance debates is
        to join the discussion with the community.
      </Description>

      <InfoCard
        src={ChatBubble}
        header={'Join the discussion'}
        description={'Stay up to date and share thoughts with the community.'}
        className='sm:mr-4 mb-8'
        links={
          <span className='text-sm'>
            Visit our{' '}
            <CardExternalLink
              href={POOLTOGETHER_GOV_FORUM_URL}
              title='PoolTogether Governance Forum'
            >
              forum
            </CardExternalLink>{' '}
            or{' '}
            <CardExternalLink href={DISCORD_INVITE_URL} title='PoolTogether Community Discord'>
              Discord
            </CardExternalLink>
          </span>
        }
      />

      <Header>I’m ready to vote!</Header>
      <Description>
        Got an idea how to improve the protocol? We are keen to hear your thoughts.
      </Description>

      <div className='w-full flex flex-col sm:flex-row'>
        <InfoCard
          src={VoteIcon}
          header={'Vote on active proposals'}
          description={
            'POOL holders make real change and voice opinions on the protocol through on-chain voting.'
          }
          className='mb-4 sm:mb-0 sm:mr-4'
          links={
            <CardLink as='/proposals?view=active' href='/proposals?view=active'>
              View on-chain proposals
            </CardLink>
          }
        />

        <InfoCard
          src={DollarBill}
          header={'Vote gas-free + earn rewards'}
          description={
            'ptPOOL holder can vote gas-free on SnapShot and earn extra rewards. Deposit in POOL Pool to get ptPOOL token.'
          }
          className='sm:ml-4'
          links={
            <CardLink as='/proposals?view=snapshot' href='/proposals?view=snapshot'>
              View off-chain proposals
            </CardLink>
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
    {props.links}
  </Card>
)

const Header = (props) => <h4 className='text-accent-1 mb-4'>{props.children}</h4>
const Description = (props) => (
  <p className='text-accent-1 mb-6 text-sm sm:max-w-3/4'>{props.children}</p>
)

const CardHeader = (props) => <h5 className='mb-4 mx-auto'>{props.children}</h5>
const CardDescription = (props) => <p className='mb-2 text-sm mx-auto'>{props.children}</p>
const CardLink = ({ children, as, href }) => (
  <Link as={as} href={href}>
    <a className='text-highlight-1 hover:text-accent-1'>{children}</a>
  </Link>
)
const CardExternalLink = ({ children, href, title }) => (
  <ExternalLink href={href} title={title} colorClassName='text-highlight-1 hover:text-accent-1'>
    {children}
  </ExternalLink>
)

const Icon = (props) => (
  <div className='h-16 mb-6 mx-auto flex flex-col justify-center'>
    <img src={props.src} className='w-16' />
  </div>
)
