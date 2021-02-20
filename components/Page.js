import useSwr from 'swr'
import fetcher from '../lib/fetcher'
import Post from './Post'
import Loader from './Loader'

export default function Page({ initialData, index }) {
  const { data: feedItems } = useSwr(`/api/feed?page=${index}`, fetcher, { initialData, revalidateOnMount: true })
  const isLoading = !feedItems

  return (
    <div>
      {
        isLoading ? (
          <Loader />
        ) : feedItems.map((item) => (
          <Post key={item._id} item={item} />
        ))
      }
      <style jsx>{`
      `}</style>
    </div>
  )
}
