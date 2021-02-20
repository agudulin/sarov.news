import useSwr from 'swr'
import Post from './Post'
import Loader from '../components/Loader'

export default function Page({ initialData, index }) {
  const { data: feedItems } = useSwr(`/api/feed?page=${index}`, { initialData })
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
