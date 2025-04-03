import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntButton } from 'antd'
import { useMemo } from 'react'

import type { ButtonSchema } from '../../types/Button.schema'
import type { Action } from '../../utils/types'
import { getActionsMap } from '../../utils/utils'

interface Props {
  widgetData: ButtonSchema['spec']['widgetData']
  actions?: Action[]
}

const Button: React.FC<Props> = ({ widgetData: data, actions }) => {
  const { label, icon, type } = data
  const actionsMap = useMemo(() => getActionsMap(actions), [actions])

  return (
    <AntButton
      icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
      onClick={actionsMap['onClick']}
      type={type}
    >
      {label}
    </AntButton>
  )
}

export default Button
