import useSWR from 'swr'
import fetcher from '../lib/fetcher'
import Navbar from '../components/Navbar'

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString('ru', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
                <time dateTime={item.isoDate}>{formatDate(item.isoDate)}</time>
                <h3>{item.title}</h3>
              </header>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
              <footer>
                <a href={item.link} rel='noopener' target='_blank'>Читать далее</a>
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
          padding: 1rem;
        }
        section > footer p {
          font-size: 0.8rem;
        }

        main > article {
          padding: 2rem 1rem;
          margin: 1rem 0;
        }
        main > article:not(:last-child) {
          border-bottom: 1px solid var(--color-black-01);
        }
        main > article :global(p) :global(img) {
          margin: 0 -1rem 1rem;
          width: calc(100% + 2rem);
        }
        main > article > footer {
          padding: 1rem;
          font-size: 0.75rem;
          margin: 0 -1rem;
          width: calc(100% + 2rem);
        }
        main > article > footer a {
          text-decoration: none;
          padding: 0.5rem 0.875rem;
          border: 1px solid var(--color-link);
          border-radius: 3px;
          transition: opacity ease 0.1s;
          opacity: 0.7;
        }
        main > article > footer a:hover {
          opacity: 1;
        }
        main > article time {
          text-transform: uppercase;
          font-weight: 600;
          color: var(--color-info);
        }
        main > article time + h3 {
          margin-top: 0.5rem;
        }
      `}</style>
    </section>
  )
}

export async function getServerSideProps() {
  const data = await fetcher(`/api/feed`)
  return { props: { initialData: data } }
}
