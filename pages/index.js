import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import Navbar from '../components/Navbar'

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString('ru')
}

export default function Home({ initialData }) {
  const { data, error } = useSWR('/api/feed', { initialData })

  return (
    <section>
      <header>
        <Navbar />
      </header>
      <main>
        {
          error ? (
            <article>
              <p align='middle'>Новостей пока нет.</p>
            </article>
          ) : !data ? (
            <article>
              <p align='middle'>Загружаем...</p>
            </article>
          ) : data.items?.map((item) => (
            <article key={item.guid}>
              <header>
                <h3>{item.title}</h3>
                <time dateTime={item.isoDate}>{formatDate(item.isoDate)}</time>
              </header>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
              <footer>
                <a href={item.link} target='_blank'>читать дальше</a>
              </footer>
            </article>
          ))
        }
      </main>
      <footer>
        <p>Контент перепечатан с сайта <a href='https://sarov.info' target='_blank'>www.sarov.info</a></p>
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
        }
        section > footer p {
          font-size: 0.8rem;
        }

        main > article {
          padding: 1rem 1rem 0;
        }
        main > article :global(p) :global(img) {
          margin: 0 -1rem 1rem;
          width: calc(100% + 2rem);
        }
        main > article > footer {
          font-size: 0.8rem;
          padding: 1rem;
          text-align: center;
          margin: 0 -1rem;
          width: calc(100% + 2rem);
        }
        main > article:not(:last-child) > footer {
          border-bottom: 1px solid var(--color-black-01);
        }
        main > article > footer a {
          text-transform: uppercase;
        }
      `}</style>
    </section>
  )
}

export async function getServerSideProps() {
  const data = await fetcher(`/api/feed`)
  return { props: { initialData: data } }
}
