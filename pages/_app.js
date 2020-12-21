import Head from 'next/head'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const title = 'Новости Сарова'
  const description = 'Последние новости и события города Саров'

  return <>
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
      />
      <title>{title}</title>

      <meta name='application-name' content={title} />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />
      <meta name='description' content={description} />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name="theme-color" content="#a0daa9" />

      <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
      <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
      <link rel='manifest' href='/manifest.json' />
      <link rel='preconnect' href='https://fonts.gstatic.com' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Inter&subset=cyrillic,cyrillic-ext,latin-ext' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto+Slab&subset=cyrillic,cyrillic-ext,latin-ext' />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:url' content='https://sarov.app' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content='https://sarov.app/icons/android-icon-192x192.png' />
      <meta name='twitter:creator' content='@agudulin' />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={title} />
      <meta property='og:url' content='https://sarov.app' />
      <meta property='og:image' content='https://sarov.app/icons/apple-touch-icon.png' />

      <script
        async
        defer
        data-domain="sarov.app"
        src="https://plausible.io/js/plausible.js"
      />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
