import React, { useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

import { DropdownList } from 'lib/components/DropdownList'

// TODO: Switch this back to being dynamically generated based on locize
export function LanguagePicker(props) {
  const langs = {
    en: {
      name: 'English',
      nativeName: 'English'
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español'
    },
    de: {
      name: 'German',
      nativeName: 'Deutsch'
    },
    fr: {
      name: 'French',
      nativeName: 'Français'
    },
    it: {
      name: 'Italian',
      nativeName: 'Italiana'
    },
    ko: {
      name: 'Korean',
      nativeName: '한국어 (韓國語)'
    },
    pt: {
      name: 'Portuguese',
      nativeName: 'Português'
    },
    tr: {
      name: 'Turkish',
      nativeName: 'Türkçe'
    },
    zh: {
      name: 'Zhōngwén',
      nativeName: '中文'
    }
  }

  const { i18n: i18next } = useTranslation()

  const [currentLang, setCurrentLang] = useState(i18next.language)

  const changeLang = (newLang) => {
    setCurrentLang(newLang)
    i18next.changeLanguage(newLang)
  }

  const formatValue = (key) => {
    const lang = langs[key]

    return (
      <>
        {key.toUpperCase()} - <span className='capitalize'>{lang.nativeName.split(',')[0]}</span> (
        {lang.name.split(';')[0]})
      </>
    )
  }

  return (
    <DropdownList
      id='language-picker-dropdown'
      className={classnames('text-xxs sm:text-sm ml-4 mr-1')}
      // className={classnames('text-xxs sm:text-sm', className)}
      label={currentLang?.toUpperCase()}
      formatValue={formatValue}
      onValueSet={changeLang}
      current={currentLang}
      values={langs}
    />
  )
}
