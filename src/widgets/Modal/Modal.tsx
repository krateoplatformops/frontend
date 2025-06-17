import { Modal as AntdModal } from 'antd'
import { useEffect, useState } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'

import { ModalProvider } from './ModalContext'

export const openModal = (widgetEndpoint: string) => {
  window.dispatchEvent(new CustomEvent('openModal', { detail: widgetEndpoint }))
}

export const closeModal = () => {
  window.dispatchEvent(new CustomEvent('closeModal'))
}

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetEndpoint, setWidgetEndpoint] = useState<string | null>(null)
  const [modalData, setModalData] = useState<{ footer?: React.ReactNode; title?: string }>({})

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<string>) => {
      setWidgetEndpoint(event.detail)
      setIsOpen(true)
    }

    const handleCloseModal = () => {
      setIsOpen(false)
    }

    window.addEventListener('openModal', handleOpenModal as EventListener)
    window.addEventListener('closeModal', handleCloseModal)

    return () => {
      window.removeEventListener('openModal', handleOpenModal as EventListener)
      window.removeEventListener('closeModal', handleCloseModal)
    }
  }, [])

  if (!widgetEndpoint) {
    return null
  }

  return (
    <AntdModal
      footer={modalData.footer || null}
      key={
        /* This make sure that the content of the modal is destroyed and recreated when
        the modal is closed and reopened, to prevent the form from showing stale data
        */
        isOpen ? 'open' : 'closed'
      }
      onCancel={() => setIsOpen(false)}
      open={isOpen}
      title={modalData.title}
    >
      <ModalProvider setModalData={setModalData}>
        <WidgetRenderer key={'modal'} widgetEndpoint={widgetEndpoint} />
      </ModalProvider>
    </AntdModal>
  )
}

export default Modal
