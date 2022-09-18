
import { HeaderLogo, PageTitleAndBreadcrumbs } from '@pooltogether/react-components'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import React from 'react'

export function ErrorPage() {
  const { t } = useTranslation()

  return (
    <>
      <div
        className='flex flex-col w-full'
        style={{
          minHeight: '100vh'
        }}
      >
        <div className='header fixed w-full bg-body z-30 pt-1 pb-1 xs:pt-2 xs:pb-0 sm:py-0 mx-auto l-0 r-0'>
          <div className='flex justify-center items-center px-4 xs:px-12 sm:px-10 py-4 xs:pb-6 sm:pt-5 sm:pb-7 mx-auto'>
            <HeaderLogo />
          </div>
        </div>

        <div className='content mx-auto' style={{ maxWidth: 700 }}>
          <div className='my-0 text-inverse pt-32 px-6 xs:pt-32 xs:px-20'>
            <PageTitleAndBreadcrumbs
              Link={Link}
              title={`${t('error')}`}
              breadcrumbs={[]}
              className='mb-10'
            />

            <h4>{t('anErrorOccurredAndWeveBeenNotified')}</h4>
            <h6>{t('pleaseTryAgainSoon')}</h6>
          </div>
        </div>
      </div>
    </>
  )
}
