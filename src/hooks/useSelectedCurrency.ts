import { atom, useAtom, useSetAtom } from 'jotai'
import { CURRENCY_ID, SUPPORTED_CURRENCIES } from '../constants/currencies'

const getInitialSelectedCurrencyId = () => {
  if (typeof window === 'undefined') return 'usd'
  const cachedCurrency = localStorage.getItem('selectedCurrency') as CURRENCY_ID
  if (!!cachedCurrency && Object.keys(SUPPORTED_CURRENCIES).includes(cachedCurrency)) {
    return cachedCurrency
  } else {
    return 'usd'
  }
}

export const selectedCurrencyIdAtom = atom<CURRENCY_ID>(getInitialSelectedCurrencyId())

export const useSelectedCurrency = () => {
  const [currency] = useAtom(selectedCurrencyIdAtom)
  const setCurrency = useSetAtom(setSelectedCurrencyIdWriteAtom)
  return {
    currency,
    setCurrency
  }
}

export const setSelectedCurrencyIdWriteAtom = atom<null, CURRENCY_ID>(
  null,
  (get, set, currencyId) => {
    if (typeof window !== 'undefined') {
      // Set in atom
      set(selectedCurrencyIdAtom, currencyId)
      // Set in localstorage
      localStorage.setItem('selectedCurrency', currencyId)
    }
  }
)
