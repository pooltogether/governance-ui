import React, { useContext } from 'react'
import Dialog from '@reach/dialog'
import FeatherIcon from 'feather-icons-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import DelegateableERC20ABI from 'abis/DelegateableERC20ABI'
import { useTranslation } from 'lib/../i18n'
import { getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTokenHolder } from 'lib/hooks/useTokenHolder'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { DelegateAddress } from 'lib/components/delegates/DelegateAddress'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { TxStatus } from 'lib/components/TxStatus'

import PoolIcon from 'assets/images/pool-icon.svg'
import Squiggle from 'assets/images/squiggle.svg'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { testAddress } from 'lib/utils/testAddress'

export const DelegatePoolModal = (props) => {
  const { t } = useTranslation()
  const { isOpen, closeModal } = props

  const { data: poolTokenData, isFetched: poolTokenDataIsFetched } = usePoolTokenData()
  const { usersAddress } = useContext(AuthControllerContext)
  const {
    data: tokenHolder,
    isFetched: tokenHolderIsFetched,
    refetch: refetchTokenHolderData
  } = useTokenHolder(usersAddress)
  const [showDelegateeForm, setShowDelegateeForm] = useState(false)

  const delegateAddress = tokenHolder?.delegate?.id
  const usersBalance = poolTokenData?.usersBalance

  if (!poolTokenDataIsFetched || !tokenHolderIsFetched) return null

  return (
    <Dialog aria-label='Delegate POOL Token Modal' isOpen={isOpen} onDismiss={closeModal}>
      <div className='text-inverse p-4 bg-card h-full sm:h-auto rounded-none sm:rounded-xl sm:max-w-sm mx-auto flex flex-col'>
        <div className='flex'>
          <button
            className='my-auto ml-auto close-button trans text-inverse hover:opacity-30'
            onClick={closeModal}
          >
            <FeatherIcon icon='x' className='w-6 h-6' />
          </button>
        </div>

        <div className='flex mx-auto'>
          <img src={PoolIcon} className='shadow-xl rounded-full w-28 h-28 spinningCoin' />
          <div className='flex flex-col ml-8 justify-center mr-8'>
            <h3>{numberWithCommas(usersBalance, { precision: getPrecision(usersBalance) })}</h3>
            <span className='text-accent-1'>POOL</span>
          </div>
        </div>

        <div className='bg-body p-4 rounded-xl mt-8'>
          {!showDelegateeForm && delegateAddress && (
            <>
              <div className='flex justify-between'>
                <span className='text-accent-1 capitalize'>{t('delegatee')}:</span>
                <span className='font-bold'>
                  {delegateAddress ? (
                    <DelegateAddress alwaysShorten address={delegateAddress} />
                  ) : (
                    '--'
                  )}
                </span>
              </div>
              <div className='flex justify-end mt-4'>
                <button
                  className='text-xxs text-inverse hover:opacity-70 trans'
                  type='button'
                  onClick={(e) => {
                    e.preventDefault()
                    setShowDelegateeForm(true)
                  }}
                >
                  {t('changeDelegatee')}
                </button>
              </div>
            </>
          )}
          {(showDelegateeForm || !delegateAddress) && (
            <SetDelegateeRow
              isFormHideable={Boolean(delegateAddress)}
              hideForm={() => setShowDelegateeForm(false)}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

const SetDelegateeRow = (props) => {
  const { hideForm, isFormHideable, refetchTokenHolderData } = props
  const { t } = useTranslation()

  const { usersAddress, chainId } = useContext(AuthControllerContext)
  const { register, handleSubmit, setValue } = useForm()

  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const handleDelegate = async (address) => {
    const params = [address]

    const id = await sendTx(
      t('delegate'),
      DelegateableERC20ABI,
      CONTRACT_ADDRESSES[chainId].GovernanceToken,
      'delegate',
      params,
      {
        refetch: refetchTokenHolderData
      }
    )
    setTxId(id)
  }

  const onSubmit = async (data) => {
    handleDelegate(data.delegateeAddress)
  }

  const onError = (data) => console.error('Error', data)

  const onSelfDelegateClick = (e) => {
    e.preventDefault()
    setValue('delegateeAddress', usersAddress)
  }

  if (tx && !tx.cancelled) {
    return (
      <div className='flex flex-col text-center'>
        <TxStatus tx={tx} />
        {tx && tx.completed && (
          <Button
            className='mt-6'
            textSize='xxxs'
            type='button'
            onClick={(e) => {
              e.preventDefault()
              hideForm()
            }}
          >
            {t('back')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      {isFormHideable && (
        <div className='flex justify-end mb-8'>
          <button
            className='text-xxs text-inverse hover:opacity-70 trans'
            type='button'
            onClick={(e) => {
              e.preventDefault()
              hideForm()
            }}
          >
            {t('hideDelegateeForm')}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className='mb-2 flex'>
          {t('delegatee')}:
          <img src={Squiggle} className='mx-auto my-2' />
          <button type='button' onClick={onSelfDelegateClick}>
            {t('selfDelegate')}
          </button>
        </div>
        <input
          className='bg-card w-full p-2 rounded-sm outline-none focus:outline-none active:outline-none hover:bg-primary focus:bg-primary trans trans-fast border border-transparent focus:border-card'
          id={'_newDelegateeAddress'}
          name={'delegateeAddress'}
          ref={register}
          type='text'
          autoComplete={'hidden'}
          placeholder='0x123abc'
        />
        <div className='flex justify-end mt-4'>
          <Button textSize='xxxs' type='submit'>
            {t('submit')}
          </Button>
        </div>
      </form>
    </>
  )
}
