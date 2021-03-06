export default function Footer() {
  return (
    <footer>
      <p>Контент перепечатан с сайта <a href='https://sarov.info' rel='noopener' target='_blank'>sarov.info</a></p>
      <p>
        <img src='/icons/telegram.svg' alt='telegram logo' />
        <a href='https://t.me/sarov_news' rel='noopener' target='_blank'>sarov_news</a>
      </p>
      <style jsx>{`
        footer {
          width: 100%;
          max-width: 700px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          border-top: 1px solid var(--color-black-01);
          margin-top: 1rem;
          padding: 1rem;
        }
        footer p {
          font-size: 0.8rem;
          margin: 0;
        }
        footer img {
          display: inline;
          width: 1rem;
          margin: 0 4px -4px 0;
        }
      `}</style>
    </footer>
  )
}
