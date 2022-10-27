import { useGovernanceChainId } from '@pooltogether/hooks'
import {
  Card,
  LinkTheme,
  Button,
  Tooltip,
  SimpleTimeDisplay,
  useCountdown
} from '@pooltogether/react-components'
import { getNetworkNiceNameByChainId } from '@pooltogether/utilities'
import {
  TransactionState,
  TransactionStatus,
  useSendTransaction,
  useTransaction,
  useUsersAddress,
  useWalletChainId
} from '@pooltogether/wallet-connection'
import classnames from 'classnames'
import { Contract, ethers, Overrides } from 'ethers'
import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { useSigner } from 'wagmi'
import GovernorAlphaABI from '../../abis/GovernorAlphaABI'
import { DelegateAddress } from '../../components/DelegateAddress'
import { ProposalStatus } from '../../components/Proposals/ProposalsList'
import { TxText } from '../../components/TxText'
import { CONTRACT_ADDRESSES, PROPOSAL_STATUS } from '../../constants'
import { useInterval } from '../../hooks/useInterval'
import { useIsWalletOnProperNetwork } from '../../hooks/useIsWalletOnProperNetwork'
import { useProposalVotes } from '../../hooks/useProposalVotes'
import { useProposalVotesTotalPages } from '../../hooks/useProposalVotesTotalPages'
import { useTokenHolder } from '../../hooks/useTokenHolder'
import { useVoteData } from '../../hooks/useVoteData'
import { getSecondsSinceEpoch } from '../../utils/getCurrentSecondsSinceEpoch'

export const ProposalVoteCard = (props) => {
  const { proposal, refetchProposalData, blockNumber } = props

  const { t } = useTranslation()
  const { id, title, status, proposer } = proposal
  const { id: authorsAddress } = proposer

  const usersAddress = useUsersAddress()
  const { data: tokenHolderData } = useTokenHolder(usersAddress, blockNumber)
  const {
    data: voteData,
    isFetched: voteDataIsFetched,
    refetch: refetchVoteData
  } = useVoteData(tokenHolderData?.delegate?.id, id)

  const refetchData = () => {
    refetchVoteData()
    refetchProposalData()
  }

  const showButtons =
    usersAddress &&
    (status === PROPOSAL_STATUS.active ||
      status === PROPOSAL_STATUS.succeeded ||
      status === PROPOSAL_STATUS.queued)

  return (
    <Card className='mb-6'>
      <div className='flex justify-between flex-col-reverse sm:flex-row'>
        <h4 className='mr-2'>{title}</h4>
        <ProposalStatus proposal={proposal} />
      </div>

      <div className='text-xs text-accent-1'>
        <span className='mr-2'>Proposed by:</span>
        <DelegateAddress className='text-xs' theme={LinkTheme.light} address={authorsAddress} />
      </div>

      {voteDataIsFetched && voteData?.delegateDidVote && (
        <div className='flex my-auto mt-2'>
          <h6 className='font-normal mr-2 sm:mr-4'>{t('myVote')}:</h6>
          <div
            className={classnames('flex my-auto', {
              'text-green': voteData.support,
              'text-red': !voteData.support
            })}
          >
            <FeatherIcon
              icon={voteData.support ? 'check-circle' : 'x-circle'}
              className='w-6 h-6 mr-2'
            />
            <p className='font-bold'>{voteData.support ? t('accept') : t('reject')}</p>
          </div>
        </div>
      )}

      {showButtons && (
        <>
          {status === PROPOSAL_STATUS.active && (
            <VoteButtons
              usersAddress={usersAddress}
              id={id}
              refetchData={refetchData}
              canVote={tokenHolderData?.canVote}
              alreadyVoted={voteData?.delegateDidVote}
            />
          )}
          {status === PROPOSAL_STATUS.succeeded && (
            <QueueButton id={id} refetchData={refetchData} />
          )}
          {status === PROPOSAL_STATUS.queued && (
            <ExecuteButton
              id={id}
              refetchData={refetchData}
              executionETA={Number(proposal?.executionETA)}
              proposal={proposal}
            />
          )}
        </>
      )}
    </Card>
  )
}

const VoteButtons = (props) => {
  const { id, refetchData, canVote, alreadyVoted, usersAddress } = props

  const router = useRouter()
  const page = router?.query?.page ? parseInt(router.query.page as string, 10) : 1
  const { refetch: refetchTotalVotesPages } = useProposalVotesTotalPages(id)
  const { refetch: refetchVoterTable } = useProposalVotes(id, page)
  const isWalletOnProperNetwork = useIsWalletOnProperNetwork()

  const { t } = useTranslation()

  const { data: signer } = useSigner()
  const chainId = useGovernanceChainId()
  const sendTx = useSendTransaction()
  const [txId, setTxId] = useState('')
  const [votingFor, setVotingFor] = useState<boolean>()
  const governanceAddress = CONTRACT_ADDRESSES[chainId]?.GovernorAlpha
  const tx = useTransaction(txId)

  const handleVoteFor = (e) => {
    e.preventDefault()
    setVotingFor(true)
    castVote(true)
  }

  const handleVoteAgainst = (e) => {
    e.preventDefault()
    setVotingFor(false)
    castVote(false)
  }

  const refetch = () => {
    refetchData()
    refetchTotalVotesPages()
    refetchVoterTable()
  }

  const castVote = async (support) => {
    const params = [id, support]

    const name = t('sendVoteForProposalId', { support: support ? t('accept') : t('reject'), id })

    const txId = await sendTx({
      name,
      callTransaction: () => {
        const contract = new Contract(governanceAddress, GovernorAlphaABI, signer)
        return contract.functions.castVote(...params)
      },
      callbacks: {
        refetch
      }
    })
    setTxId(txId)
  }

  const cannotVote = !canVote || alreadyVoted

  let isButtonDisabled = false
  if (!isWalletOnProperNetwork || cannotVote) {
    isButtonDisabled = true
  }

  let tip = t('yourWalletIsOnTheWrongNetwork', {
    networkName: getNetworkNiceNameByChainId(chainId)
  })
  if (cannotVote) {
    tip = t(
      'youAreUnableToVoteMakeSure',
      'You are unable to vote on this proposal. To activate voting make sure you have delegated your POOL to yourself prior to a proposal start date.'
    )
  }

  if (tx?.state === TransactionState.complete && tx?.status === TransactionStatus.success) {
    return (
      <TxText className='text-green ml-auto'>
        🎉 {t('successfullyVoted')} - {votingFor ? t('accept') : t('reject')} 🎉
      </TxText>
    )
  }

  if (
    tx?.state === TransactionState.pending &&
    tx?.status === TransactionStatus.pendingUserConfirmation
  ) {
    return <TxText className='ml-auto'>{t('pleaseConfirmInYourWallet')}</TxText>
  }

  if (
    tx?.state === TransactionState.pending &&
    tx?.status === TransactionStatus.pendingBlockchainConfirmation
  ) {
    return <TxText className='ml-auto'>{t('waitingForConfirmations')}...</TxText>
  }

  return (
    <div className='flex mt-2 justify-end sm:mt-4'>
      {tx?.status === TransactionStatus.error && (
        <div className='text-red flex'>
          <FeatherIcon icon='alert-triangle' className='h-4 w-4 stroke-current my-auto mr-2' />
          <p>{t('errorWithTxPleaseTryAgain')}</p>
        </div>
      )}
      <Tooltip isEnabled={isButtonDisabled} id={`tooltip-proposal-vote-yes`} tip={tip}>
        <Button onClick={handleVoteFor} className='mr-4' disabled={isButtonDisabled || !signer}>
          <div className='flex'>
            <FeatherIcon icon='check-circle' className='my-auto mr-2 h-4 w-4 sm:h-6 sm:w-6' />
            {t('accept')}
          </div>
        </Button>
      </Tooltip>

      <Tooltip isEnabled={isButtonDisabled} id={`tooltip-proposal-vote-no`} tip={tip}>
        <Button onClick={handleVoteAgainst} disabled={!isWalletOnProperNetwork || cannotVote}>
          <div className='flex'>
            <FeatherIcon icon='x-circle' className='my-auto mr-2 h-4 w-4 sm:h-6 sm:w-6' />
            {t('reject')}
          </div>
        </Button>
      </Tooltip>
    </div>
  )
}

const QueueButton = (props) => {
  const { id, refetchData } = props

  const { data: signer } = useSigner()
  const { t } = useTranslation()
  const walletChainId = useWalletChainId()
  const sendTx = useSendTransaction()
  const isWalletOnProperNetwork = useIsWalletOnProperNetwork()
  const [txId, setTxId] = useState('')
  const governanceAddress = CONTRACT_ADDRESSES[walletChainId]?.GovernorAlpha
  const tx = useTransaction(txId)

  const handleQueueProposal = async (e) => {
    e.preventDefault()

    const params = [id]

    const txId = await sendTx({
      name: t('queueProposal', { id }),
      callTransaction: () => {
        const contract = new Contract(governanceAddress, GovernorAlphaABI, signer)
        return contract.functions.queue(...params)
      },
      callbacks: {
        refetch: refetchData
      }
    })
    setTxId(txId)
  }

  if (tx?.state === TransactionState.complete && tx?.status === TransactionStatus.success) {
    // Successfully Queued Proposal #{ id }
    return (
      <TxText className='text-green ml-auto'>
        🎉 {t('successfullyQueuedProposalId', { id })} 🎉
      </TxText>
    )
  }

  if (
    tx?.state === TransactionState.pending &&
    tx?.status === TransactionStatus.pendingUserConfirmation
  ) {
    return <TxText className='ml-auto'>{t('pleaseConfirmInYourWallet')}</TxText>
  }

  if (
    tx?.state === TransactionState.pending &&
    tx?.status === TransactionStatus.pendingBlockchainConfirmation
  ) {
    return <TxText className='ml-auto'>{t('waitingForConfirmations')}...</TxText>
  }

  return (
    <div className='flex mt-2 justify-end'>
      {tx?.status === TransactionStatus.error && (
        <Tooltip
          id={`tx-error-${tx?.receipt?.transactionHash || ''}`}
          tip={
            <div className='flex'>
              <p>{t('errorWithTxPleaseTryAgain')}</p>
            </div>
          }
        >
          <FeatherIcon
            icon='alert-triangle'
            className='h-4 w-4 text-red stroke-current my-auto mr-2'
          />
        </Tooltip>
      )}
      <Button onClick={handleQueueProposal} disabled={!isWalletOnProperNetwork || !signer}>
        {t('queueProposal')}
      </Button>
    </div>
  )
}

const ExecuteButton = (props) => {
  const { id, refetchData, executionETA, proposal } = props

  const { data: signer } = useSigner()
  const { t } = useTranslation()
  const walletChainId = useWalletChainId()
  const sendTx = useSendTransaction()
  const isWalletOnProperNetwork = useIsWalletOnProperNetwork()
  const [txId, setTxId] = useState('')
  const governanceAddress = CONTRACT_ADDRESSES[walletChainId]?.GovernorAlpha
  const tx = useTransaction(txId)

  const [currentTime, setCurrentTime] = useState(getSecondsSinceEpoch())

  useInterval(() => {
    setCurrentTime(getSecondsSinceEpoch())
  }, 1000)

  const { seconds, minutes, hours, days } = useCountdown(executionETA)

  const payableAmountInWei = useMemo(
    () =>
      proposal.values.reduce(
        (totalPayableAmount, currentPayableAmount) =>
          totalPayableAmount.add(ethers.BigNumber.from(currentPayableAmount)),
        ethers.BigNumber.from(0)
      ),
    [proposal.values]
  )
  const payableAmountInEther = ethers.utils.formatEther(payableAmountInWei)

  const handleExecuteProposal = async (e) => {
    e.preventDefault()

    const params = [id]

    const txId = await sendTx({
      name: t('executeProposalId', { id }),
      callTransaction: () => {
        const contract = new Contract(governanceAddress, GovernorAlphaABI, signer)
        const value = payableAmountInWei.toHexString()
        return contract.functions.execute(...params, { value } as Overrides)
      },

      callbacks: {
        refetch: refetchData
      }
    })
    setTxId(txId)
  }

  if (tx?.state === TransactionState.complete && tx?.status === TransactionStatus.success) {
    return (
      <TxText className='text-green ml-auto'>
        🎉 {t('successfullyExecutedProposalId', { id })} 🎉
      </TxText>
    )
  }

  if (
    tx?.state === TransactionState.pending &&
    tx?.status === TransactionStatus.pendingUserConfirmation
  ) {
    return <TxText className='ml-auto'>{t('pleaseConfirmInYourWallet')}</TxText>
  }

  if (
    tx?.state === TransactionState.pending &&
    tx?.status === TransactionStatus.pendingBlockchainConfirmation
  ) {
    return <TxText className='ml-auto'>{t('waitingForConfirmations')}...</TxText>
  }

  return (
    <>
      {currentTime < executionETA && (
        <div className='flex'>
          <span className='xs:ml-auto mt-auto text-accent-1'>{t('executableIn')}</span>
          <SimpleTimeDisplay t={t} seconds={seconds} minutes={minutes} hours={hours} days={days} />
        </div>
      )}
      <div className='flex mt-2 justify-end'>
        {tx?.status === TransactionStatus.error && (
          <Tooltip
            id={`tx-error-${tx?.receipt?.transactionHash || ''}`}
            tip={
              <div className='flex'>
                <p>{t('errorWithTxPleaseTryAgain')}</p>
              </div>
            }
          >
            <FeatherIcon
              icon='alert-triangle'
              className='h-4 w-4 text-red stroke-current my-auto mr-2'
            />
          </Tooltip>
        )}
        {!payableAmountInWei.isZero() && (
          <Tooltip
            id='wei-tooltip'
            tip={
              <div className='flex'>
                <p>{t('executionCostInEth', { amount: payableAmountInEther.toString() })}</p>
              </div>
            }
          >
            <FeatherIcon
              icon='alert-circle'
              className='h-4 w-4 text-inverse stroke-current my-auto mr-2'
            />
          </Tooltip>
        )}
        <Button
          onClick={handleExecuteProposal}
          disabled={currentTime < executionETA || !isWalletOnProperNetwork}
        >
          {t('executeProposal')}
        </Button>
      </div>
    </>
  )
}
