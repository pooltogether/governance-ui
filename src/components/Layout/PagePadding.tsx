import classNames from 'classnames'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/router'
import React from 'react'

interface PagePaddingProps {
  children?: React.ReactNode
  className?: string
  paddingClassName?: string
  widthClassName?: string
  marginClassName?: string
}

export const PagePadding = (props: PagePaddingProps) => {
  const { className, children, paddingClassName, widthClassName, marginClassName } = props

  const shouldReduceMotion = useReducedMotion()
  const router = useRouter()

  return (
    <AnimatePresence>
      <motion.div
        key={`page-padding-animation-wrapper-${router.pathname}`}
        transition={{ duration: shouldReduceMotion ? 0 : 0.1, ease: 'easeIn' }}
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className={classNames(paddingClassName, widthClassName, marginClassName, className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

PagePadding.defaultProps = {
  paddingClassName: 'px-4 sm:px-8 pb-20 pt-8',
  widthClassName: 'max-w-screen-sm',
  marginClassName: 'mx-auto'
}
