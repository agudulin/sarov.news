import { useState } from 'react'
import fetcher from '../lib/fetcher'
import Navbar from '../components/Navbar'
import Page from '../components/Page'
import Button from '../components/Button'

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0)
  const handlePageIndexChange = (nextIndex) => () => {
    window.scroll({ top: 0, left: 0 })
    setPageIndex(nextIndex > 0 ? nextIndex : 0)
  }

  return (
    <section>
      <header>
        <Navbar onClick={handlePageIndexChange(0)} />
      </header>
      <main>
        <Page index={pageIndex} />
        <div style={{ display: 'none' }}><Page index={pageIndex + 1}/></div>
        <footer>
          <Button disabled={pageIndex === 0} onClick={handlePageIndexChange(pageIndex - 1)}>← Сюда</Button>
          <Button onClick={handlePageIndexChange(pageIndex + 1)}>Туда →</Button>
        </footer>
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
        main > footer {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 0 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </section>
  )
}

//export async function getStaticProps() {
  //const feedData = await fetcher(`/api/feed?page=0`)

  //return {
    //props: { feedData },
    //revalidate: 60,
  //}
//}
