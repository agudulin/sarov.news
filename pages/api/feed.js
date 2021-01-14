import fetch from 'isomorphic-unfetch'
import stripHtml from 'string-strip-html'
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

async function createTelegramPosts(items) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`

  return Promise.all(items.map((item) => {
    const text = `*${item.title}*\n\n${stripHtml(item.content).result}\n\n[${item.link}](${item.link})`

    return fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'chat_id': process.env.TELEGRAM_CHAT_ID,
        'text': text,
        'parse_mode': 'Markdown',
        'disable_web_page_preview': true,
        'disable_notification': false,
      })
    })
  }))
}

async function fetchRss() {
  const mainFeed = await rssParser.parseURL('https://sarov.info/main/rss')
  const zatoFeed = await rssParser.parseURL('https://sarov.info/news/zato/rss')
  const cppFeed = await rssParser.parseURL('https://sarov.info/news/cpp/rss')

  const items = applyFeedFormatters([ ...mainFeed.items, ...zatoFeed.items, ...cppFeed.items ])
  console.log(`👉 ${items.length} rss items fetched`)

  return items
}

export default async function handler(req, res) {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const feedCollection = await db.collection('feed')
  const statsCollection = await db.collection('stats')

  const stats = await statsCollection.findOne({})
  const now = new Date()
  const shouldFetchRssFeed = ((now - stats.lastRssFeedFetched) > 20 * 60 * 1000) && !stats.processing

  if (shouldFetchRssFeed) {
    console.log('👉 refreshing feed item started')
    await statsCollection.updateOne({ _id: stats._id }, { $set: { lastRssFeedFetched: now, processing: true } })

    try {
      const rssFeedItems = await fetchRss()
      const existentFeedItems = await feedCollection.find({ link: { $in: rssFeedItems.map((i) => i.link) } }).toArray()
      const feedItemsToInsert = rssFeedItems.filter((i) => !existentFeedItems.some((item) => item.link === i.link))

      console.log(`👉 ${feedItemsToInsert.length} new items to add to db`)
      feedItemsToInsert.forEach((item) => console.log(`...${item.link}`))

      if (feedItemsToInsert.length > 0) {
        await feedCollection.insertMany(feedItemsToInsert, { ordered: false })
        await createTelegramPosts(feedItemsToInsert)
      }

      await statsCollection.updateOne({ _id: stats._id }, { $set: { processing: false } })
      console.log('👉 refreshing feed item finished')
    } catch (err) {
      console.log('❌ can\'t fetch rss feed')
      await statsCollection.updateOne({ _id: stats._id }, { $set: {
        lastRssFeedFetched: now,
        processing: false,
        error: true,
      } })
      console.log(err)
    }
  }

  const feedItems = await feedCollection.find({}).sort({ isoDate: -1 }).toArray()

  res.json(feedItems)
}
