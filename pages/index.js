import useSwr from 'swr'
import fetcher from '../lib/fetcher'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Post from '../components/Post'

export default function Home({ feedData }) {
  const { data: feedItems } = useSwr('/api/feed', { initialData: feedData })
  const isLoading = !feedItems

  return (
    <section>
      <header>
        <Navbar />
      </header>
      <main>
        {
          isLoading ? (
            <Loader />
          ) : feedItems.map((item) => (
            <Post key={item._id} item={item} />
          ))
        }
      </main>
      <footer>
        <p>Контент перепечатан с сайта <a href='https://sarov.info' rel='noopener' target='_blank'>www.sarov.info</a></p>
      </footer>
      <style jsx>{`
        section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        section > header {
          width: 100%;
        }
        section > main {
          width: 100%;
          max-width: 700px;
        }
        section > footer {
          width: 100%;
          display: flex;
          justify-content: center;
          border-top: 1px solid var(--color-black-01);
          margin-top: 1rem;
          padding: 1rem;
        }
        section > footer p {
          font-size: 0.8rem;
        }
      `}</style>
    </section>
  )
}

export async function getStaticProps() {
  const feedData = await fetcher('/api/feed')

  return {
    props: { feedData },
    revalidate: 1,
  }
}
