import React, { useState } from 'react'
import classnames from 'classnames'
import { Modal, PoolIcon, ButtonLink } from '@pooltogether/react-components'
import { useGovernanceChainId } from '@pooltogether/hooks'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useCoingeckoTokenInfoQuery } from 'lib/hooks/useCoingeckoTokenInfoQuery'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTotalClaimablePool } from 'lib/hooks/useTotalClaimablePool'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import Squiggle from 'assets/images/squiggle.svg'

export const NavPoolBalance = (props) => {
  const { className } = props
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
        className={classnames(
          'flex relative text-highlight-4 hover:text-white font-bold cursor-pointer pool-gradient-1 rounded-full px-3 xs:px-4 p-2 leading-none trans',
          className
        )}
        onClick={openModal}
      >
        <span className={classnames('sm:block hidden mr-1', className)}>
          {numberWithCommas(usersBalance)}
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

  const chainId = useGovernanceChainId()

  const { total: totalClaimablePool } = useTotalClaimablePool()

  const totalClaimablePoolFormatted = numberWithCommas(totalClaimablePool)
  const formattedBalance = numberWithCommas(usersBalance)
  const formattedTotalSupply = numberWithCommas(totalSupply)

  const tokenAddress = CONTRACT_ADDRESSES[chainId]?.GovernanceToken
  const { data: tokenInfo } = useCoingeckoTokenInfoQuery(tokenAddress)
  const formattedInCirculation = numberWithCommas(tokenInfo?.market_data?.circulating_supply)

  const openClaimRewards = (e) => {
    closeModal()
  }

  return (
    <Modal
      label='POOL Token Details Modal'
      isOpen={isOpen}
      closeModal={closeModal}
      className='flex flex-col'
    >
      <div className='flex mx-auto'>
        <PoolIcon className='shadow-xl w-28 h-28 spinningCoin' />
        <div className='flex flex-col ml-8 justify-center mr-8 leading-none'>
          <h2>{numberWithCommas(usersBalance)}</h2>
          <span className='font-bold text-accent-1 mt-1'>POOL</span>
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
          <span className='text-accent-1'>{t('inCirculation')}:</span>
          <span className='font-bold'>{formattedInCirculation}</span>
        </div>

        <div className='flex justify-between'>
          <span className='text-accent-1'>{t('totalSupply')}:</span>
          <span className='font-bold'>{formattedTotalSupply}</span>
        </div>
      </div>

      <ButtonLink
        Link={Link}
        textSize='xxxs'
        onClick={openClaimRewards}
        href='https://app.pooltogether.com/account#governance-claims'
        as='https://app.pooltogether.com/account#governance-claims'
        width='w-full'
        className='mt-4'
      >
        {t('claimPool')}
      </ButtonLink>
      <ButtonLink
        Link={Link}
        textSize='xxxs'
        as='https://sybil.org/#/delegates/pool'
        href='https://sybil.org/#/delegates/pool'
        width='w-full'
        className='mt-4'
      >
        {t('activateVotingPower')}
      </ButtonLink>
    </Modal>
  )
}
