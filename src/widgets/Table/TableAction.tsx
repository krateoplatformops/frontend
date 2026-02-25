import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntdButton } from 'antd'
import useApp from 'antd/es/app/useApp'

import { useHandleAction } from '../../hooks/useHandleActions'
import type { ResourcesRefs } from '../../types/Widget'

import type { NormalizedRow } from './Table'
import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

type TableActionType = {
  actions: TableWidgetData['actions']
  tableAction: NonNullable<TableWidgetData['tableActions']>[number]
  row: NormalizedRow
  resourcesRefs: ResourcesRefs
  uid: string
}

const TableAction = ({ actions, resourcesRefs, row, tableAction, uid }: TableActionType) => {
  const {
    button: {
      backgroundColor,
      icon,
      label,
      shape,
      size,
      type,
    } = {},
    clickActionId,
  } = tableAction

  const { notification } = useApp()
  const { handleAction, isActionLoading } = useHandleAction()

  const action = Object.values(actions ?? {})
    .flat()
    .find(({ id }) => id === clickActionId)

  const onClick = async () => {
    if (!action) {
      notification.error({
        description: `The widget definition does not include an action (ID: ${clickActionId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    const { cells, key, ...payload } = row

    await handleAction(action, resourcesRefs, payload)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()

    onClick().catch((error) => {
      console.error('Error in button click handler:', error)
    })
  }

  return (
    <div>
      <AntdButton
        icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
        key={uid}
        loading={isActionLoading}
        onClick={(event) => handleClick(event)}
        shape={shape || 'default'}
        size={size || 'middle'}
        style={{ backgroundColor: backgroundColor || undefined }}
        type={type || 'primary'}
      >
        {label}
      </AntdButton>
    </div>
  )
}

export default TableAction
