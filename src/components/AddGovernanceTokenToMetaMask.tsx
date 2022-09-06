import React from 'react'

import { useTranslation } from 'react-i18next'
import { SquareButton } from '@pooltogether/react-components'
import { addTokenToMetaMask } from '../utils/addTokenToMetaMask'
import { useGovernanceChainId } from '@pooltogether/hooks'

export function AddGovernanceTokenToMetaMask(props) {
  const { t } = useTranslation()
  const chainId = useGovernanceChainId()

  const handleAddTokenToMetaMask = (e) => {
    e.preventDefault()
    addTokenToMetaMask(chainId)
  }

  return (
    <div className='flex flex-col sm:flex-row items-center justify-center my-20'>
      {walletName === 'MetaMask' && (
        <>
          <div className='m-2'>
            <SquareButton onClick={handleAddTokenToMetaMask}>
              {t('addPoolTokenToMetamask')}
            </SquareButton>
          </div>
        </>
      )}
    </div>
  )
}
