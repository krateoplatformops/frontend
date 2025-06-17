import { noop } from 'lodash'
import { createContext, useContext } from 'react'

type ModalData = {
  extra?: React.ReactNode
  title?: string
}

type ModalContextValue = {
  insideModal: true
  setModalData: (data: ModalData) => void
}

type ModalProviderProps = {
  children: React.ReactNode
  setModalData: (data: ModalData) => void
}

const ModalContext = createContext<ModalContextValue>({
  insideModal: true,
  setModalData: noop,
})

export const ModalProvider: React.FC<ModalProviderProps> = ({ children, setModalData }) => {
  return (
    <ModalContext.Provider
      value={{
        insideModal: true,
        setModalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => {
  const context = useContext(ModalContext)

  /* is ok that context is nullable, we will use this to check if the consumer is a child of the context provider (and so if it's inside a Modal) */
  return context || { insideModal: false }
}
