import Image from 'next/image'
import Markdown from 'markdown-to-jsx'

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleString('ru', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const markdownOptions = {
  overrides: {
    img: {
      component: Image,
      props: {
        layout: 'fill',
        unsized: true,
      }
    }
  },
  namedCodesToUnicode: {
    amp: '&',
    copy: '©',
    ge: '\u2265',
    laquo: '«',
    le: '\u2264',
    minus: '–',
    raquo: '»',
    thinsp: '\u202f',
  }
}

export default function Post({ item }) {
  return (
    <article>
      <header>
        <time dateTime={item.isoDate}>{formatDate(item.isoDate)}</time>
        <h3>{item.title}</h3>
      </header>
      <Markdown options={markdownOptions}>{item.content}</Markdown>
      <footer>
        <a href={item.link} rel='noopener' target='_blank'>Читать далее</a>
      </footer>
      <style jsx>{`
        article {
          padding: 2rem 1rem;
          margin: 1rem 0;
        }
        article:not(:last-child) {
          border-bottom: 1px solid var(--color-black-01);
        }
        article :global(p) :global(img) {
          margin: 0 -1rem 1rem;
          width: calc(100% + 2rem);
        }
        article > footer {
          padding: 1rem;
          font-size: 0.75rem;
          margin: 0 -1rem;
          width: calc(100% + 2rem);
        }
        article > footer a {
          text-decoration: none;
          text-transform: uppercase;
          padding: 0.05rem;
          border-bottom: 1px dotted var(--color-link);
        }
        article > footer a:hover {
          border-bottom: 1px solid var(--color-link);
        }
        article time {
          text-transform: uppercase;
          font-weight: 600;
          color: var(--color-info);
        }
        article time + h3 {
          margin-top: 0.5rem;
        }
      `}</style>
    </article>
  )
}
