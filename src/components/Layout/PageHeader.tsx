import {
  LanguagePickerDropdown,
  PageHeaderContainer,
  SettingsContainer,
  SettingsItem,
  TestnetSettingsItem,
  FeatureRequestSettingsItem,
  ThemeSettingsItem,
  SocialLinks,
  HeaderLogo
} from '@pooltogether/react-components'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { SUPPORTED_LANGUAGES } from '../../languages'
import { FullWalletConnectionButtonWrapper } from './FullWalletConnectionButtonWrapper'

export enum ContentPaneState {
  deposit = 'deposit',
  prizes = 'prizes',
  account = 'account'
}

export const PageHeader = (props) => {
  return (
    <PageHeaderContainer
      logo={
        <Link href='/'>
          <a>
            <HeaderLogo />
          </a>
        </Link>
      }
    >
      <div className='flex flex-row justify-end items-center space-x-4'>
        <FullWalletConnectionButtonWrapper />
        <Settings />
      </div>
    </PageHeaderContainer>
  )
}

const Settings = () => {
  const { t } = useTranslation()

  return (
    <SettingsContainer t={t} className='ml-1 my-auto' sizeClassName='w-6 h-6 overflow-hidden'>
      <div className='flex flex-col justify-between h-full sm:h-auto'>
        <div>
          <LanguagePicker />
          <ThemeSettingsItem t={t} />
          <TestnetSettingsItem t={t} />
          <FeatureRequestSettingsItem t={t} />
          <ClearLocalStorageSettingsItem />
        </div>
        <div className='sm:pt-24 pb-4 sm:pb-0'>
          <SocialLinks t={t} />
        </div>
      </div>
    </SettingsContainer>
  )
}

const LanguagePicker = () => {
  const { i18n: i18next, t } = useTranslation()
  const router = useRouter()

  return (
    <SettingsItem label={t('language')}>
      <LanguagePickerDropdown
        locales={['en', 'es', 'de', 'fa', 'fil', 'fr', 'hi', 'it', 'ko', 'pt', 'tr', 'zh', 'sk']}
        className='dark:text-white'
        currentLang={i18next.language}
        onValueSet={(newLocale) => {
          i18next.changeLanguage(newLocale)
          router.push({ pathname: router.pathname, query: router.query }, router.asPath, {
            locale: newLocale
          })
        }}
      />
    </SettingsItem>
  )
}

const ClearLocalStorageSettingsItem = () => {
  const { t } = useTranslation()
  return (
    <SettingsItem label={t('clearStorage', 'Clear storage')}>
      <button
        className='font-semibold text-pt-red-light transition-colors hover:text-pt-red'
        onClick={() => {
          if (
            window.confirm(
              t(
                'clearingStorageWarning',
                'Continuing will clear the websites storage in your browser. This DOES NOT have any effect on your deposits.'
              )
            )
          ) {
            localStorage.clear()
            window.location.reload()
          }
        }}
      >
        {t('clear', 'Clear')}
      </button>
    </SettingsItem>
  )
}
