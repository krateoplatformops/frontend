import { Modal as AntdModal } from 'antd'
import { useEffect, useState } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'

import styles from './Modal.module.css'

interface ModalProps {
  widgetEndpoint: string
  title?: string | undefined
}

export const openModal = (properties: ModalProps) => {
  window.dispatchEvent(new CustomEvent('openModal', { detail: properties }))
}

export const closeModal = () => {
  window.dispatchEvent(new CustomEvent('closeModal'))
}

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [properties, setProperties] = useState<ModalProps | null>(null)

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<ModalProps>) => {
      setProperties(event.detail)
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

  if (!properties) {
    return null
  }

  const { title, widgetEndpoint } = properties

  return (
    <AntdModal
      className={styles.modal}
      footer={null}
      key={
        /* This make sure that the content of the modal is destroyed and recreated when
        the modal is closed and reopened, to prevent the form from showing stale data
        */
        isOpen ? 'open' : 'closed'
      }
      onCancel={() => setIsOpen(false)}
      open={isOpen}
      title={title}
    >
      <WidgetRenderer key={'modal'} widgetEndpoint={widgetEndpoint} />
    </AntdModal>
  )
}

export default Modal
