import { LoadingLogo } from '@pooltogether/react-components'
import React from 'react'

export const LoadingScreen = () => (
  <div className='flex flex-col h-screen absolute top-0 w-screen'>
    <LoadingLogo className='m-auto' />
  </div>
)
