import { useState } from 'react'
import fetcher from '../lib/fetcher'
import Navbar from '../components/Navbar'
import Page from '../components/Page'
import Button from '../components/Button'
import Footer from '../components/Footer'

export default function Home({ firstPageData }) {
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
        <Page index={pageIndex} initialData={firstPageData} />
        <div style={{ display: 'none' }}><Page index={pageIndex + 1} initialData={firstPageData} /></div>
        <footer>
          <Button disabled={pageIndex === 0} onClick={handlePageIndexChange(pageIndex - 1)}>← Сюда</Button>
          <Button onClick={handlePageIndexChange(pageIndex + 1)}>Туда →</Button>
        </footer>
      </main>
      <Footer />
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

export async function getStaticProps() {
  const firstPageData = await fetcher(`/api/feed?page=0`)

  return {
    props: { firstPageData },
    revalidate: 60,
  }
}
