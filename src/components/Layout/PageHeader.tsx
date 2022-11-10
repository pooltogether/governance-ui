import { PageHeaderContainer, HeaderLogo, SettingsModal } from '@pooltogether/react-components'
import {
  NetworkSelectionCurrentlySelected,
  NetworkSelectionList,
  useWalletChainId
} from '@pooltogether/wallet-connection'
import { getSupportedChains } from '@utils/getSupportedChains'
import classNames from 'classnames'
import FeatherIcon from 'feather-icons-react'
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
  const { t, i18n: i18next } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const walletChainId = useWalletChainId()
  const [currentLang, setCurrentLang] = useState(i18next.language)
  const router = useRouter()

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <FeatherIcon
          icon='menu'
          className={classNames('w-6 h-6 text-gradient-magenta hover:text-inverse transition')}
        />
      </button>
      <SettingsModal
        t={t}
        isOpen={isOpen}
        walletChainId={walletChainId}
        closeModal={() => setIsOpen(false)}
        networkView={() => <NetworkView />}
        langs={SUPPORTED_LANGUAGES}
        currentLang={currentLang}
        changeLang={(newLang) => {
          setCurrentLang(newLang)
          i18next.changeLanguage(newLang)
          router.push({ pathname: router.pathname, query: router.query }, router.asPath, {
            locale: newLang
          })
        }}
        customButton={{
          link: 'https://app.pooltogether.com',
          title: t('coreApp', 'Core App'),
          description: t('pooltogetherCoreApp', 'PoolTogether App')
        }}
      />
    </>
  )
}

const NetworkView = () => {
  const chains = getSupportedChains()
  const { t } = useTranslation()
  return (
    <>
      <p className='mb-3 text-center'>
        Selecting a network will prompt you to switch to the network selected in your wallet.
      </p>
      <NetworkSelectionList chains={chains} />
      <NetworkSelectionCurrentlySelected t={t} />
    </>
  )
}
