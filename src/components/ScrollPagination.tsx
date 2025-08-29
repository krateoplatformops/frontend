import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export const ScrollPagination = ({
  children,
  fetchNextPage,
  hasNextPage,
}: {
  fetchNextPage: () => Promise<unknown> | void
  hasNextPage: boolean
  children: React.ReactNode
}) => {
  const { inView, ref } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])

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
