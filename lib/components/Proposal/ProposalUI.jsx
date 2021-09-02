import React, { useEffect, useLayoutEffect, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import ReactMarkdown from 'react-markdown'
import classnames from 'classnames'
import gfm from 'remark-gfm'
import { useRouter } from 'next/router'
import {
  BlockExplorerLink,
  Card,
  PageTitleAndBreadcrumbs,
  Tooltip
} from '@pooltogether/react-components'
import { useGovernanceChainId } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'

import { DEFAULT_TOKEN_PRECISION, PROPOSAL_STATUS } from 'lib/constants'
import { AddGovernanceTokenToMetaMask } from 'lib/components/AddGovernanceTokenToMetaMask'
import { CardTitle } from 'lib/components/CardTitle'
import { VotersTable } from 'lib/components/Proposal/VotersTable'
import { useProposalData } from 'lib/hooks/useProposalData'
import { calculateVotePercentage, formatVotes } from 'lib/utils/formatVotes'
import { useEtherscanAbi } from 'lib/hooks/useEtherscanAbi'
import { shorten } from 'lib/utils/shorten'
import { useGovernorAlpha } from 'lib/hooks/useGovernorAlpha'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { ProposalVoteCard } from 'lib/components/Proposal/ProposalVoteCard'
import { PoolPoolProposalCard } from 'lib/components/Proposal/PoolPoolProposalCard'
import { usePoolPoolProposal } from 'lib/hooks/usePoolPoolProposal'
import Link from 'next/link'
import { VotingPowerCard } from 'lib/components/VotingPowerCard'

const SMALL_DESCRIPTION_LENGTH = 500

export const ProposalUI = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  const { id } = router.query

  const chainId = useGovernanceChainId()

  const { refetch: refetchProposalData, proposal, isFetched, error } = useProposalData(id)
  const { data: poolPoolData, isFetched: poolPoolProposalIsFetched } = usePoolPoolProposal(
    chainId,
    id
  )

  if (!proposal || (!proposal && !isFetched)) {
    return null
  }

  const blockNumber = Number(proposal.startBlock)
  const snapshotBlockNumber = Boolean(poolPoolData?.proposal?.snapshot)
    ? Number(poolPoolData.proposal.snapshot)
    : null

  return (
    <>
      <PageTitleAndBreadcrumbs
        className='mb-10'
        Link={Link}
        title={t('proposals')}
        breadcrumbs={[
          {
            href: '/',
            as: '/',
            name: t('governance')
          },
          {
            href: '/proposals',
            as: '/proposals',
            name: t('proposals')
          },
          {
            name: t('proposalId', { id })
          }
        ]}
      />
      <VotingPowerCard
        blockNumber={blockNumber}
        snapshotBlockNumber={snapshotBlockNumber}
        className='mb-10'
      />
      <ProposalVoteCard
        blockNumber={blockNumber}
        proposal={proposal}
        refetchProposalData={refetchProposalData}
      />
      <PoolPoolProposalCard
        proposal={proposal}
        blockNumber={blockNumber}
        snapshotBlockNumber={snapshotBlockNumber}
      />
      <VotesCard proposal={proposal} isFetched={isFetched} id={id} />
      <ProposalDescriptionCard proposal={proposal} />
      <ProposalActionsCard proposal={proposal} />

      <AddGovernanceTokenToMetaMask />
    </>
  )
}

const ProposalDescriptionCard = (props) => {
  const { proposal } = props

  const { t } = useTranslation()
  const { description } = proposal
  const smallDescription = description.length < SMALL_DESCRIPTION_LENGTH
  const [showMore, setShowMore] = useState(smallDescription)

  return (
    <>
      <CardTitle>{t('description')}</CardTitle>
      <Card className='mb-6'>
        <div
          className={classnames('proposal-details')}
          style={{ maxHeight: showMore ? 'unset' : '300px' }}
        >
          {!showMore && (
            <div
              className='w-full h-full absolute'
              style={{
                backgroundImage: showMore
                  ? 'unset'
                  : 'linear-gradient(0deg, var(--color-bg-card) 5%, transparent 100%)'
              }}
            />
          )}
          <ReactMarkdown
            plugins={[gfm]}
            className='description whitespace-pre-wrap break-words'
            children={description}
          />
        </div>
        <ShowMoreButton
          isVisible={!smallDescription}
          showMore={showMore}
          setShowMore={setShowMore}
        />
      </Card>
    </>
  )
}

const ProposalActionsCard = (props) => {
  const { t } = useTranslation()
  const { proposal } = props
  const allowExpansion = proposal.signatures.length >= 4
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <CardTitle>{t('actions')}</CardTitle>
      <Card className='mb-6'>
        <ul
          className='overflow-hidden relative'
          style={{ maxHeight: allowExpansion ? (showMore ? 'unset' : '300px') : 'unset' }}
        >
          {proposal.signatures.map((signature, index) => {
            return (
              <ProposalActionRow
                key={index}
                actionIndex={index + 1}
                value={proposal.values[index]}
                target={proposal.targets[index]}
                calldata={proposal.calldatas[index]}
                signature={signature}
              />
            )
          })}
          {!showMore && allowExpansion && (
            <div
              className='w-full h-full absolute top-0 left-0'
              style={{
                backgroundImage: showMore
                  ? 'unset'
                  : 'linear-gradient(0deg, var(--color-bg-card) 5%, transparent 100%)'
              }}
            />
          )}
        </ul>
        <ShowMoreButton isVisible={allowExpansion} showMore={showMore} setShowMore={setShowMore} />
      </Card>
    </>
  )
}

const ShowMoreButton = (props) => {
  const { isVisible, showMore, setShowMore } = props
  const { t } = useTranslation()

  if (!isVisible) return null

  return (
    <div className='flex mt-8'>
      <button
        className='trans text-inverse hover:text-highlight-1 underline'
        type='button'
        onClick={(e) => {
          e.preventDefault
          setShowMore(!showMore)
        }}
      >
        {showMore ? t('showLess') : t('showMore')}
      </button>
    </div>
  )
}

// TODO: If there are more than 5 actions, this will cause problems since
// etherscan can only accept 5 requests a second
const ProposalActionRow = (props) => {
  const { actionIndex, calldata, signature, value, target } = props

  const [fnParameters, setFnParameters] = useState(null)
  const { t } = useTranslation()
  const { data } = useEtherscanAbi(target)
  const chainId = useGovernanceChainId()

  const fnName = signature.slice(0, signature.indexOf('('))

  useEffect(() => {
    if (data && data.status === 200 && data.data && data.data.status === '1') {
      try {
        const abi = JSON.parse(data.data.result)
        const iface = new ethers.utils.Interface(abi)
        const fnIface = iface.functions[fnName]
        const sighash = fnIface.sighash
        const fnData = calldata.replace('0x', sighash)
        const parsedData = iface.parseTransaction({ data: fnData })
        setFnParameters(
          parsedData.args.map((arg, index) => {
            const input = { ...fnIface.inputs[index] }
            if (typeof arg === 'object') {
              try {
                input.value = arg.toString()
              } catch (e) {
                input.value = '[object]'
              }
            } else {
              input.value = arg
            }
            return input
          })
        )
      } catch (e) {
        console.warn(e.message)
      }
    }
  }, [data])

  const payableAmount = ethers.utils.formatEther(value)

  return (
    <li className='flex break-all mb-4'>
      <b>{`${actionIndex}.`}</b>
      <div className='flex flex-col pl-2 text-accent-1'>
        <div className='w-full flex'>
          <span className='mr-2'>{t('contract')}:</span>
          <BlockExplorerLink chainId={chainId} className='text-sm' address={target}>
            {shorten(target)}
          </BlockExplorerLink>
        </div>

        <div className='w-full'>
          <span className='mr-2'>{t('function')}:</span>
          <span className='text-inverse'>{signature}</span>
        </div>

        {calldata !== '0x' && (
          <div className='w-full'>
            <span className='mr-2'>{t('inputs')}:</span>
            {fnParameters ? (
              <span className='text-inverse'>
                {fnParameters.map((input) => input.value).join(', ')}
              </span>
            ) : (
              <span className='text-inverse'>{calldata}</span>
            )}
          </div>
        )}

        {value > 0 && (
          <div>
            <span className='mr-2'>{t('payableAmount')}:</span>
            <span className='text-inverse'>{payableAmount} ETH</span>
          </div>
        )}
      </div>
    </li>
  )
}

const VotesCard = (props) => {
  const { id, isFetched, proposal } = props

  const { t } = useTranslation()
  const { data: governorAlpha, isFetched: governorAlphaIsFetched } = useGovernorAlpha()

  if (!isFetched || !governorAlphaIsFetched) {
    return null
  }

  const { forVotes, againstVotes, totalVotes, status } = proposal

  const noVotes = totalVotes.isZero()
  const forPercentage = noVotes ? 0 : calculateVotePercentage(forVotes, totalVotes)
  const againstPercentage = noVotes ? 0 : 100 - forPercentage

  const quorumHasBeenMet = forVotes.gt(governorAlpha.quorumVotes)
  const quorumFormatted = ethers.utils.formatUnits(
    governorAlpha.quorumVotes,
    DEFAULT_TOKEN_PRECISION
  )
  const remainingVotesForQuorum = ethers.utils.formatUnits(
    governorAlpha.quorumVotes.sub(forVotes),
    DEFAULT_TOKEN_PRECISION
  )

  return (
    <>
      <CardTitle>{t('votes')}</CardTitle>
      <Card className='mb-6'>
        {!quorumHasBeenMet && status === PROPOSAL_STATUS.active && (
          <div className='flex text-accent-1 bg-light-purple-10 py-1 px-2 rounded-sm w-fit-content ml-auto mb-6'>
            <span className='mr-2'>
              {t('numVotesNeeded', {
                num: numberWithCommas(remainingVotesForQuorum, { precision: 0 })
              })}
            </span>
            <Tooltip
              id='votes-card'
              className='my-auto'
              tip={t('forAProposalToSucceedMinNumOfVotes', {
                num: numberWithCommas(quorumFormatted, {
                  precision: 0
                })
              })}
            >
              <FeatherIcon className='my-auto w-4 h-4 stroke-current' icon='info' />
            </Tooltip>
          </div>
        )}

        <div
          className={classnames('w-full h-2 flex flex-row rounded-full overflow-hidden my-4', {
            'opacity-50': !quorumHasBeenMet
          })}
        >
          {!noVotes && (
            <>
              <div className='bg-green' style={{ width: `${forPercentage}%` }} />
              <div className='bg-warning-red' style={{ width: `${againstPercentage}%` }} />
            </>
          )}
          {noVotes && <div className='bg-tertiary w-full' />}
        </div>

        <div className={classnames('flex justify-between mb-4 sm:mb-8')}>
          <div className='flex text-green'>
            <div className='flex flex-col'>
              <h5 className='font-normal'>{t('accepted')}</h5>
              <h6 className='font-normal text-xxs sm:text-xs'>{`${formatVotes(
                forVotes
              )} (${forPercentage}%)`}</h6>
            </div>
          </div>
          <div className='flex text-functional-red text-right'>
            <div className='flex flex-col'>
              <h5 className='font-normal'>{t('rejected')}</h5>
              <h6 className='font-normal text-xxs sm:text-xs'>{`${formatVotes(
                againstVotes
              )} (${againstPercentage}%)`}</h6>
            </div>
          </div>
        </div>

        <VotersTable id={id} />
      </Card>
    </>
  )
}
