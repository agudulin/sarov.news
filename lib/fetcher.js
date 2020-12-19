import fetch from 'isomorphic-unfetch'

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://sarov.app'

export default async function fetcher(url, ...args) {
  const res = await fetch(`${baseUrl}${url}`, ...args)
  return res.json()
}
