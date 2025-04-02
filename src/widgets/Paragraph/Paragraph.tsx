import { Typography } from 'antd'

import type { ParagraphSchema } from '../../types/Paragraph.schema'

type ParagraphType = ParagraphSchema['spec']['widgetData']

const Paragraph: React.FC<ParagraphType> = ({ text }: ParagraphType) => {
  return <Typography.Paragraph>{text}</Typography.Paragraph>
}

export default Paragraph
