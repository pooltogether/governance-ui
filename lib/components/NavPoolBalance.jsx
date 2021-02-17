import React, { useContext, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { Dialog } from '@reach/dialog'

import { useTranslation } from 'lib/../i18n'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTotalClaimablePool } from 'lib/hooks/useTotalClaimablePool'
import { getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'

import Squiggle from 'assets/images/squiggle.svg'
import PoolIcon from 'assets/images/pool-icon.svg'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTokenHolder } from 'lib/hooks/useTokenHolder'
import { DelegateAddress } from 'lib/components/delegates/DelegateAddress'
import { Button } from 'lib/components/Button'
import { TxStatus } from 'lib/components/TxStatus'
import DelegateableERC20ABI from 'abis/DelegateableERC20ABI'
import { useForm } from 'react-hook-form'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { CONTRACT_ADDRESSES } from 'lib/constants'

export const NavPoolBalance = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const { data: tokenData, isFetched } = usePoolTokenData()

  if (!isFetched || !tokenData) {
    return null
  }

  const { usersBalance } = tokenData

  return (
    <>
      <div
        className='relative text-highlight-9 hover:text-white font-bold cursor-pointer pool-gradient-1 rounded-full px-3 xs:px-4 p-2 leading-none trans mr-2 flex'
        onClick={openModal}
      >
        <span className='mr-1'>
          {numberWithCommas(usersBalance, { precision: getPrecision(usersBalance) })}
        </span>
        POOL
      </div>
      <PoolBalanceModal isOpen={isOpen} closeModal={closeModal} tokenData={tokenData} />
    </>
  )
}

const PoolBalanceModal = (props) => {
  const { t } = useTranslation()
  const { isOpen, closeModal, tokenData } = props
  const { usersBalance, totalSupply } = tokenData

  const { usersAddress } = useContext(AuthControllerContext)
  const {
    data: tokenHolder,
    isFetched: tokenHolderIsFetched,
    refetch: refetchTokenHolderData,
    isFetching: tokenHolderIsFetching
  } = useTokenHolder(usersAddress)
  const [showDelegateeForm, setShowDelegateeForm] = useState(false)
  const delegateAddress = tokenHolder?.delegate?.id

  const { total: totalClaimablePool, isFetched: totalClaimableIsFetched } = useTotalClaimablePool()

  if (!tokenHolderIsFetched) {
    return null
  }

  const totalClaimablePoolFormatted = numberWithCommas(totalClaimablePool, {
    precision: getPrecision(totalClaimablePool)
  })
  const formattedBalance = numberWithCommas(usersBalance, {
    precision: getPrecision(usersBalance)
  })
  const formattedTotalSupply = numberWithCommas(totalSupply, {
    precision: 0
  })

  return (
    <Dialog aria-label='POOL Token Details Modal' isOpen={isOpen} onDismiss={closeModal}>
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
          <div className='flex justify-between'>
            <span className='text-accent-1'>{t('balance')}:</span>
            <span className='font-bold'>{formattedBalance}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-accent-1'>{t('unclaimed')}:</span>
            <span className='font-bold'>{totalClaimablePoolFormatted}</span>
          </div>

          <img src={Squiggle} className='mx-auto my-2' />

          <div className='flex justify-between'>
            <span className='text-accent-1'>{t('totalSupply')}:</span>
            <span className='font-bold'>{formattedTotalSupply}</span>
          </div>
        </div>

        <div className='bg-body p-4 rounded-xl mt-4'>
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
            <SetDelegateeForm
              refetchTokenHolderData={refetchTokenHolderData}
              isFormHideable={Boolean(delegateAddress)}
              hideForm={() => setShowDelegateeForm(false)}
            />
          )}
        </div>
      </div>
    </Dialog>
  )
}

const SetDelegateeForm = (props) => {
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
        <div className='flex justify-end mb-2'>
          <button
            className='text-xxs text-inverse hover:opacity-70 trans'
            type='button'
            onClick={(e) => {
              e.preventDefault()
              hideForm()
            }}
          >
            <FeatherIcon icon='x' className='w-6 h-6' />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className='mb-2 flex justify-between'>
          <span className='text-accent-1'>{t('delegatee')}:</span>
          {/* <img src={Squiggle} className='mx-auto my-2' /> */}
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
