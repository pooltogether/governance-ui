import { ThemeContext } from '@pooltogether/react-components'
import React, { useContext } from 'react'

export const LoadingSpinner = ({}) => {
  const { theme } = useContext(ThemeContext)

  const lightClass = theme === 'dark' && 'white'

  return <span className={`inline-block loader01 ${lightClass}`}></span>
}
