import { Breadcrumb as AntdBreadcrumb, Typography } from 'antd'
import type { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb'
import { useEffect, useState } from 'react'
import { useMatches, useNavigate } from 'react-router'

import styles from './Breadcrumb.module.css'

const getFullPath = (index: number, splitPath: string[]) => {
  const url: string[] = []

  splitPath.forEach((element, splitIndex) => {
    if (splitIndex <= index) {
      url.push(element)
    }
  })

  return url.join('/')
}

const Breadcrumb = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>()
  const matches = useMatches()

  useEffect(() => {
    const path = matches.filter(({ pathname }) => pathname !== '/')[0]?.pathname?.replace('/', '')

    if (path) {
      const items: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[] = []
      const splitPath = path.split('/')

      splitPath.forEach((pathElement, index) => {
        if (index === splitPath.length - 1) {
          items.push({
            title: (
              <Typography.Text
                className={`${styles.breadcrumbItem} ${index === 0 ? styles.capitalize : ''}`}
                ellipsis={{ tooltip: true }}
              >
                {pathElement}
              </Typography.Text>
            ),
          })
        } else {
          items.push({
            title: (
              <Typography.Text
                className={`${styles.breadcrumbItem} ${index === 0 ? styles.capitalize : ''}`}
                ellipsis={{ tooltip: true }}
              >
                <span className={styles.link} onClick={() => { void navigate(getFullPath(index, splitPath)) }}>
                  {pathElement}
                </span>
              </Typography.Text>
            ),
          })
        }
      })

      setItems(items)
    } else {
      setItems([{ title: '' }])
    }
  }, [matches, navigate])

  return <AntdBreadcrumb items={items}/>
}

export default Breadcrumb
