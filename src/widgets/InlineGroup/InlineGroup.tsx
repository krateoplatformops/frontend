import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './InlineGroup.module.css'
import type { InlineGroup as WidgetType } from './InlineGroup.type'

export type InlineGroupWidgetData = WidgetType['spec']['widgetData']

const gapMap: Record<NonNullable<InlineGroupWidgetData['gap']>, React.CSSProperties['gap']> = {
  'extra-small': 'var(--spacing-xs)',
  large: 'var(--spacing-lg)',
  medium: 'var(--spacing-md)',
  small: 'var(--spacing-sm)',
}

const justifyContentMap: Record< NonNullable<InlineGroupWidgetData['alignment']>, React.CSSProperties['justifyContent']> = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
}

const InlineGroup = ({ resourcesRefs, uid, widgetData }: WidgetProps<InlineGroupWidgetData>) => {
  const { alignment, gap, items } = widgetData

  return (
    <div
      className={styles.inlineGroup}
      key={uid}
      style={{
        gap: gapMap[gap ?? 'small'],
        justifyContent: justifyContentMap[alignment ?? 'left'],
      }}
    >
      {items
        .map(({ resourceRefId }, index) => {
          const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
          if (!endpoint) {
            return null
          }

          return <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={endpoint} />
        })
        .filter(Boolean)}
    </div>
  )
}

export default InlineGroup
