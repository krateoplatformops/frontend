import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export const ScrollPagination = ({
  children,
  fetchNextPage,
  hasNextPage,
  // isFetching,
  isFetchingNextPage,
  isFetchingResourcesRefs,
}: {
  fetchNextPage: () => Promise<unknown> | void
  hasNextPage: boolean
  children: React.ReactNode
  isFetching: boolean
  isFetchingNextPage: boolean
  isFetchingResourcesRefs: boolean
}) => {
  const { inView, ref } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchingResourcesRefs) {
      void fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage, isFetchingResourcesRefs])

  return (
    <>
      {children}

      <div ref={ref}>
        {/* <div>isFetching: {isFetching.toString()}</div>
        <div>isFetchingNextPage: {isFetchingNextPage.toString()}</div>
        <div>isFetchingResourcesRefs: {isFetchingResourcesRefs.toString()}</div>
        <div>has more items: {hasNextPage?.toString()}</div> */}
      </div>
    </>
  )
}
