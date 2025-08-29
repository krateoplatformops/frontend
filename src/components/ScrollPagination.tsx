import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export const ScrollPagination = ({
  children,
  fetchNextPage,
  hasNextPage,
  isFetching,
}: {
  fetchNextPage: () => Promise<unknown> | void
  hasNextPage: boolean
  children: React.ReactNode
  isFetching: boolean
}) => {
  const { inView, ref } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView, isFetching])

  return (
    <>
      {children}

      <div ref={ref} style={{ fontSize: '80px', height: '100px' }}>
        <div>inView: {inView.toString()}</div>
        <div>has more items: {hasNextPage?.toString()}</div>
      </div>
    </>
  )
}
