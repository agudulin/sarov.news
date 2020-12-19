import RssParser from 'rss-parser'

const compose = (...fns) => (...args) => fns.reduceRight((y, f) => f(y), ...args)
const rssParser = new RssParser()

const removeClassNames = (str = '') => {
  return str.replace(/\sclass=".+?"/g, '')
}
const removeStyles = (str = '') => {
  return str.replace(/\s(style|bgcolor|rel|title)=".+?"/g, '')
}
const removeTable = (str = '') => {
  return str.replace(/<table[\s\W\w]+<\/table>/g, '')
}

const applyFeedFormatters = (rawFeed) => {
  return {
    ...rawFeed,
    items: rawFeed.items.map((item) => {
      return {
        ...item,
        content: compose(removeTable, removeClassNames, removeStyles)(item.content),
      }
    }),
  }
}

export default async function handler(req, res) {
  const feedRaw = await rssParser.parseURL('https://sarov.info/main/rss')
  const feed = applyFeedFormatters(feedRaw)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(feed))
}
