import { useGovernanceChainId } from '@pooltogether/hooks'
import { Button } from '@pooltogether/react-components'
import { useIsWalletMetamask } from '@pooltogether/wallet-connection'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { addTokenToMetaMask } from '../utils/addTokenToMetaMask'

export function AddGovernanceTokenToMetaMask(props) {
  const { t } = useTranslation()
  const chainId = useGovernanceChainId()
  const isMetamask = useIsWalletMetamask()

  const handleAddTokenToMetaMask = (e) => {
    e.preventDefault()
    addTokenToMetaMask(chainId)
  }

  return (
    <div className='flex flex-col sm:flex-row items-center justify-center my-20'>
      {isMetamask && (
        <>
          <div className='m-2'>
            <Button onClick={handleAddTokenToMetaMask}>{t('addPoolTokenToMetamask')}</Button>
          </div>
        </>
      )}
    </div>
  )
}
