export default function Custom404() {
  return (
    <section>
        <h1>👻 404 – Страница не найдена</h1>
        <a href='/'>Вернуться на главную</a>
      <style jsx>{`
        h1 {
          font-size: calc(2rem + 2.5vw);
          text-align: center;
        }
        a {
          font-size: calc(1rem + 1vw);
        }
        section {
          height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
        }
      `}</style>
    </section>
  )
}
