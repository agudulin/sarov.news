export default function Button({ ...props }) {
  return (
    <>
      <button {...props} />
      <style jsx>{`
        button {
          font-family: var(--font-family-text);
          font-size: 0.8rem;
          display: inline-block;
          padding: 0.5rem 1.2rem;
          border-radius: 2px;
          text-decoration: none;
          text-align: center;
          border: 1px solid var(--color-link);
          color: var(--color-link);
          background-color: var(--color-white);
          cursor: pointer;
        }
        button:disabled {
          border-color: var(--color-link-disabled);
          color: var(--color-link-disabled);
          cursor: not-allowed;
        }
        button:not(:disabled):hover {
          color: var(--color-white);
          background-color: var(--color-link);
        }
      `}</style>
    </>
  )
}
