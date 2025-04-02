import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'

import type { ButtonSchema } from '../../types/Button.schema'

type ButtonType = ButtonSchema['spec']['widgetData']

const Button: React.FC<ButtonType> = ({ icon, label, type }: ButtonType) => {
  return (
    <AntButton icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined} type={type}>
      {label}
    </AntButton>
  )
}

export default Button
