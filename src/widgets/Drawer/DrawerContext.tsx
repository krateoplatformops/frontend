import { createContext, useContext } from 'react'

const DrawerContext = createContext<{
  setDrawerData: (data: { title?: string; extra?: React.ReactNode }) => void
  insideDrawer: true}>({
      insideDrawer: true,
      setDrawerData: () => {},
    })

export const DrawerProvider: React.FC<{
  children: React.ReactNode
  setDrawerData: (data: { title?: string; extra?: React.ReactNode }) => void
}> = ({ children, setDrawerData }) => {
  return (
    <DrawerContext.Provider
      value={{
        insideDrawer: true,
        setDrawerData,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawerContext = () => {
  const context = useContext(DrawerContext)

  /* is ok that context is nullable, we will use this to check if the consumer is a child of the context provider (and so if it's inside a Drawer) */
  return context || { insideDrawer: false }
}
