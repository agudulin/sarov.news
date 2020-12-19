import RssParser from 'rss-parser'

const compose = (...fns) => (...args) => fns.reduceRight((y, f) => f(y), ...args)
const rssParser = new RssParser()

const sortByDateTime = (items) => {
  if (!items) return null
  return [...items].sort((a, b) => a.isoDate > b.isoDate ? -1 : 1)
}

const removeClassNames = (str) => str.replace(/\sclass=".+?"/g, '')
const removeStyles = (str) => str.replace(/\s(style|bgcolor|rel|title)="[^"]+?"/g, '')
const removeTable = (str) => str.replace(/<table[\s\W\w]+<\/table>/g, '')
const replaceHttpWithHttps = (str) => str.replace(/http:\/\/www.sarov.info/g, 'https://www.sarov.info')
const reduceNesting = (str) => str.replace(/<span>(.+?)<\/span>/g, '$1')
const replaceIframe = (str) => str.replace(/<iframe .+? src="([^"]+)".+?>/g, '<a href="$1" rel="noopener" target="_blank">$1</a><br/>')
const normalizeIframeLinks = (str) => str.replace(/https:\/\/www.sarov.info\/\/www/g, 'https://www')
const replaceHeadings = (str) => str.replace(/▶/g, '👉 ')

const applyFeedFormatters = (rawFeed) => {
  return {
    ...rawFeed,
    items: rawFeed.items.map((item) => {
      return {
        ...item,
        content: compose(
          replaceHeadings,
          normalizeIframeLinks,
          replaceIframe,
          reduceNesting,
          removeTable,
          removeStyles,
          removeClassNames,
          replaceHttpWithHttps,
        )(item.content),
      }
    }),
  }
}

export default async function handler(req, res) {
  const mainFeed = await rssParser.parseURL('https://sarov.info/main/rss')
  const zatoFeed = await rssParser.parseURL('https://sarov.info/news/zato/rss')

  const feedRaw = {
    ...mainFeed,
    items: sortByDateTime([
      ...mainFeed.items,
      ...zatoFeed.items,
    ]),
  }

  const feed = applyFeedFormatters(feedRaw)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(feed))
}
