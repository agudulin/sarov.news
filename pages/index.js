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
        <p>Контент перепечатан с сайта <a href='https://sarov.info' rel='noopener' target='_blank'>sarov.info</a></p>
        <p>
          <img src='/icons/telegram.svg' alt='telegram logo' />
          <a href='https://t.me/sarov_news' rel='noopener' target='_blank'>sarov_news</a>
        </p>
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
          max-width: 700px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          border-top: 1px solid var(--color-black-01);
          margin-top: 1rem;
          padding: 1rem;
        }
        section > footer p {
          font-size: 0.8rem;
          margin: 0;
        }
        section > footer img {
          display: inline;
          width: 1rem;
          margin: 0 4px -4px 0;
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
