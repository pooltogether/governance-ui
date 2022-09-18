import { SquareLink } from '@pooltogether/react-components'
import { useUsersAddress } from '@pooltogether/wallet-connection'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'
import { Banner } from '../components/Banner'

// TODO: Fetch has user claimed pool
export const RetroactivePoolClaimBanner = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  if (true) {
    return null
  }

  return (
    <Banner theme={'rainbow'} className='mb-12'>
      <div className='flex sm:flex-row flex-col'>
        <div className='mb-3 sm:mb-2 ml-0 mr-auto sm:mr-4 sm:mt-1'>
          <img className='shake' src={'bell@2x.png'} style={{ maxWidth: 30 }} />
        </div>
        <div>
          <h6>{t('youCanClaimPool')}</h6>
          <p className='mt-1 mb-5 text-xs sm:text-sm w-full xs:w-10/12 sm:w-9/12'>
            {t('retroactivePoolBannerDescription')}
          </p>
          <Link href={`https://v3.pooltogether.com?claim=1&address=${usersAddress}`}>
            <SquareLink type='button' className='w-full xs:w-auto'>
              {t('claimPool')}
            </SquareLink>
          </Link>
        </div>
      </div>
    </Banner>
  )
}
