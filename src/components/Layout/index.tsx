import classNames from 'classnames'
import React from 'react'
import { Navigation } from './Navigation'
import { PageHeader } from './PageHeader'

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
