import { useGovernanceChainId } from '@pooltogether/hooks'
import { shorten } from '@pooltogether/utilities'
import { BlockExplorerLink } from '@pooltogether/wallet-connection'
import FeatherIcon from 'feather-icons-react'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import { Banner } from '../components/Banner'

export const TxStatus = (props) => {
  const { tx } = props
  const { hideOnInWallet, hideOnSent, hideOnSuccess, hideOnError } = props
  const { inWalletMessage, sentMessage, successMessage, errorMessage } = props
  const [showExtraMessage, setShowExtraMessage] = useState(false)
  const chainId = useGovernanceChainId()
  const { t } = useTranslation()

  const txCancelled = tx?.cancelled
  const txInWallet = tx?.inWallet && !tx?.sent
  const txSent = tx?.sent && !tx?.completed
  const txCompleted = tx?.completed
  const txError = Boolean(tx?.error)

  useEffect(() => {
    let key
    if (txSent) {
      key = setTimeout(() => setShowExtraMessage(true), 15000)
    }
    return () => {
      key && clearTimeout(key)
    }
  }, [txSent])

  if (!tx) return null
  if (txCancelled) return null
  if (hideOnInWallet && txInWallet) return null
  if (hideOnSent && txSent) return null
  if (hideOnSuccess && txCompleted) return null
  if (hideOnError && txError) return null

  return (
    <>
      {txSent && !txCompleted && !txError && (
        <Loader type='Oval' height={50} width={50} color='#bbb2ce' />
      )}

      {txCompleted && !txError && (
        <FeatherIcon
          icon='check-circle'
          className={'mx-auto stroke-1 w-16 h-16 stroke-current text-green mb-4'}
        />
      )}

      {txCompleted && txError && (
        <FeatherIcon
          icon='x-circle'
          className={'mx-auto stroke-1 w-16 h-16 stroke-current text-red mb-4'}
        />
      )}

      <div className='text-white text-sm'>{t('transactionStatus')}</div>

      {txInWallet && !txError && (
        <div className='text-sm sm:text-base text-orange'>
          {inWalletMessage ? inWalletMessage : t('pleaseConfirmInYourWallet')}
        </div>
      )}

      {txSent && (
        <div className='text-sm sm:text-base text-white'>
          {sentMessage ? sentMessage : t('transactionSentConfirming')}
        </div>
      )}

      {txCompleted && !txError && (
        <div className='text-green text-sm sm:text-base'>
          {successMessage ? successMessage : t('transactionSuccessful')}
        </div>
      )}

      {txError && (
        <div className='text-red text-sm sm:text-base'>
          {errorMessage ? errorMessage : t('transactionFailed')}
        </div>
      )}

      {tx.hash && (
        <div className='text-xxs sm:text-sm text-accent-1 opacity-80 mt-2'>
          {t('transactionHash')}
          <BlockExplorerLink
            chainId={chainId}
            txHash={tx.hash}
            className='underline text-accent-1 opacity-80'
          >
            {shorten(tx.hash)}
          </BlockExplorerLink>
        </div>
      )}

      {showExtraMessage && (
        <div className='text-xxs sm:text-sm text-accent-4 mt-2'>
          {t('transactionsMayTakeAFewMinutes')}
        </div>
      )}
    </>
  )
}

TxStatus.defaultProps = {
  hideOnError: false,
  hideOnSuccess: false,
  hideOnInWallet: false,
  hideOnSent: false,
  hideExtraMessage: false
}

export const TxStatusInBanner = (props) => {
  return (
    <Banner className='flex flex-col'>
      <TxStatus {...props} />
    </Banner>
  )
}
