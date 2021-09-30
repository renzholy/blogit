import { css } from '@emotion/css'
import useSWR from 'swr'

export default function NotFound() {
  const { data } = useSWR<{ file: string }>(
    'https://aws.random.cat/meow',
    (url) => fetch(url).then((response) => response.json()),
    { revalidateOnFocus: false },
  )

  return (
    <>
      <div
        className={css`
          margin: 96px auto;
          width: fit-content;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        404
        {data ? (
          <img
            src={data.file}
            alt="random cat"
            className={css`
              margin-top: 32px;
              max-width: 90%;
            `}
          />
        ) : null}
      </div>
    </>
  )
}
