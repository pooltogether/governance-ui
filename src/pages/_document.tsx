// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    const title = 'PoolTogether Governance'
    const url = `https://vote.pooltogether.com`
    const description = `Direct the future of the PoolTogether protocol.`
    const keywords = 'ethereum'
    const twitterHandle = '@PoolTogether_'

    return (
      <Html>
        <Head>
          <>
            <title>{title}</title>
            <meta name='google' content='notranslate' />

            <link rel='icon' href='/favicon.png' type='image/x-icon' />

            <meta name='theme-color' content='#1e0b43' />
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <meta name='author' content='PoolTogether' />

            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:site_name' content={title} />
            <meta property='og:url' content={url} />
            <meta property='og:type' content='website' />
            <meta
              property='og:image'
              content={`${url}/pooltogether-facebook-share-image-1200-630@2x.png`}
            />
            <meta property='og:rich_attachment' content='true' />
            <meta property='og:image:width' content='1200' />
            <meta property='og:image:height' content='630' />

            <meta property='twitter:title' content={title} />
            <meta property='twitter:description' content={description} />
            <meta property='twitter:card' content='summary_large_image' />
            <meta property='twitter:site' content={twitterHandle} />
            <meta
              property='twitter:image:src'
              content={`${url}/pooltogether-twitter-share-image-1200-675@2x.png`}
            />
            <meta property='twitter:url' content={url} />
            <meta property='twitter:creator' content={twitterHandle} />

            <script type='text/javascript' src='/graph-error-modal.js' />
          </>
        </Head>
        <body className='bg-body text-inverse'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
