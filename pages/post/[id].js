import { useState } from 'react'
import fetcher from '../../lib/fetcher'
import Navbar from '../../components/Navbar'
import Post from '../../components/Post'
import Footer from '../../components/Footer'

export default function Item({ itemData }) {
  return (
    <section>
      <header>
        <Navbar />
      </header>
      <main>
        <Post item={itemData} singlePostPage />
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
      `}</style>
    </section>
  )
}

export async function getServerSideProps({ query }) {
  const itemData = await fetcher(`/api/post/${query.id}`)

  return {
    props: { itemData },
  }
}
