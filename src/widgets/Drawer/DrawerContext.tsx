import { noop } from 'lodash'
import { createContext, useContext } from 'react'

type DrawerData = {
  extra?: React.ReactNode
  title?: string
}

type DrawerContextValue = {
  insideDrawer: true
  setDrawerData: (data: DrawerData) => void
}

type DrawerProviderProps = {
  children: React.ReactNode
  setDrawerData: (data: DrawerData) => void
}

const DrawerContext = createContext<DrawerContextValue>({
  insideDrawer: true,
  setDrawerData: noop,
})

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children, setDrawerData }) => {
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
