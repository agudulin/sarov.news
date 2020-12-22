import RssParser from 'rss-parser'
import compose from '../../lib/compose'
import { connectToDatabase, ObjectId } from '../../lib/db'

const rssParser = new RssParser()

const removeDotFromTheEnd = (str) => str.replace(/\.\s*$/g, '')
const removeClassNames = (str) => str.replace(/\sclass=".+?"/g, '')
const removeStyles = (str) => str.replace(/\s(style|bgcolor|rel|title)="[^"]+?"/g, '')
const removeTable = (str) => str.replace(/<table[\s\W\w]+<\/table>/g, '')
const reduceNesting = (str) => str.replace(/<span>(.+?)<\/span>/g, '$1')
const replaceHttpWithHttps = (str) => str.replace(/http:\/\/www.sarov.info/g, 'https://www.sarov.info')
const normalizeIframeLinks = (str) => str.replace(/https:\/\/www.sarov.info\/\/www/g, 'https://www')
const replaceHeadings = (str) => str.replace(/▶/g, '👉 ')
const replaceHtmlCharachters = (str) => str.replace(/&#8470;/g, '№')
const replaceIframe = (str) => str
  .replace(/<iframe .+? src="([^"]+)".+?>/g, '$1<br/>')
  .replace(/<\/iframe>/g, '')

const applyFeedFormatters = (rawFeedItems) => {
  return rawFeedItems.map((item) => ({
    author: item.author ?? item.creator,
    title: removeDotFromTheEnd(item.title),
    link: item.link,
    isoDate: item.isoDate,
    content: compose(
      replaceHeadings,
      normalizeIframeLinks,
      replaceIframe,
      reduceNesting,
      removeTable,
      removeStyles,
      removeClassNames,
      replaceHtmlCharachters,
      replaceHttpWithHttps,
    )(item.content),
  }))
}

async function fetchRssAndUpdateCollection(feedCollection) {
  const mainFeed = await rssParser.parseURL('https://sarov.info/main/rss')
  const zatoFeed = await rssParser.parseURL('https://sarov.info/news/zato/rss')

  const feedItemsFromRss = applyFeedFormatters([
    ...mainFeed.items,
    ...zatoFeed.items,
  ])
  const existentFeedItems = await feedCollection.find({
    link: {
      $in: feedItemsFromRss.map((i) => i.link)
    }
  }).toArray()

  const feedItemsToInsert = feedItemsFromRss.filter((i) => !existentFeedItems.some((item) => item.link === i.link))

  if (feedItemsToInsert.length > 0) {
    feedCollection.insertMany(feedItemsToInsert, { ordered: false })
  }
}

export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const feedCollection = await db.collection('feed')
  const statsCollection = await db.collection('stats')

  const stats = await statsCollection.findOne({})
  const now = new Date()
  const twentyMinSinceLastRssFetch = (now - stats.lastRssFeedFetched) > 20 * 60 * 1000

  if (twentyMinSinceLastRssFetch) {
    statsCollection.updateOne({ _id: stats._id }, { $set: { lastRssFeedFetched: now } })
    await fetchRssAndUpdateCollection(feedCollection)
  }

  const feedItems = await feedCollection.find({}).sort({ isoDate: -1 }).toArray()

  res.json(feedItems)
}
