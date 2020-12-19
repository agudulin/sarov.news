import Link from 'next/link'

export default function Navbar() {
  return (
    <nav>
      <Link href='/'>
        <a>
          <h6>Новости Сарова</h6>
        </a>
      </Link>
      <style jsx>{`
        nav > a {
          text-decoration: none;
          color: inherit;
        }
        nav {
          border-bottom: 1px solid var(--color-black-01);
          padding: 1rem;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        nav h6 {
          margin: 0;
        }
      `}</style>
    </nav>
  )
}
