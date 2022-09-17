import { useTheme } from 'next-themes'
import React from 'react'

export const LoadingSpinner = ({}) => {
  const { theme, systemTheme } = useTheme()

  const lightClass =
    theme === 'system'
      ? systemTheme === 'dark'
        ? 'dark'
        : 'white'
      : theme === 'dark'
      ? 'dark'
      : 'white'

  return <span className={`inline-block loader01 ${lightClass}`}></span>
}
