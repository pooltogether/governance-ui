import React from 'react'
import classNames from 'classnames'
import { PageHeader } from './PageHeader'
import { Navigation } from './Navigation'

interface LayoutProps {
  className?: string
  children: React.ReactNode
}

const Layout = (props: LayoutProps) => {
  const { children, className } = props

  return (
    <div className={classNames(className, 'min-h-screen minimal-scrollbar')}>
      <PageHeader />
      <Navigation />
      {children}
    </div>
  )
}

export default Layout
