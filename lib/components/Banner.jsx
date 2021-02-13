import React from 'react'
import classnames from 'classnames'

export const BannerTheme = {
  purplePink: 'purplePink',
  rainbow: 'rainbow',
  rainbowBorder: 'rainbowBorder',
  purplePinkBorder: 'purplePinkBorder'
}

const BannerUnmemoized = (props) => {
  const { theme, className, children, style, outerClassName, innerClassName } = props

  const bannerClass = 'p-6 sm:p-8 rounded-sm'

  if (theme === BannerTheme.rainbow) {
    return (
      <div
        className={classnames(bannerClass, 'text-purple', className)}
        style={{
          ...style,
          backgroundImage: 'url("/BackgroundGradient.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        {children}
      </div>
    )
  } else if (theme === BannerTheme.rainbowBorder) {
    return (
      <div
        className={classnames('text-inverse p-1 rounded-lg', outerClassName)}
        style={{
          backgroundImage: 'url("/BackgroundGradient.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        <div className={classnames(bannerClass, 'bg-body', innerClassName)} style={style}>
          {children}
        </div>
      </div>
    )
  } else if (theme === BannerTheme.purplePinkBorder) {
    return (
      <div className={classnames('text-inverse p-1 rounded-lg pool-gradient-1', outerClassName)}>
        <div className={classnames(bannerClass, 'bg-body', innerClassName)} style={style}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={classnames(bannerClass, 'pool-gradient-1', className)} style={style}>
      {children}
    </div>
  )
}

BannerUnmemoized.defaultProps = {
  theme: BannerTheme.purplePink
}

export const Banner = React.memo(BannerUnmemoized)
