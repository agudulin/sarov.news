const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  images: {
    domains: ['sarov.info', 'www.sarov.info'],
  },
  i18n: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },
  pwa: {
    disable: process.env.NODE_ENV === 'development',
    dest: 'public',
    runtimeCaching,
  },
})
