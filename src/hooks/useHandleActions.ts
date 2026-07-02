import type { QueryClient } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import useApp from 'antd/es/app/useApp'
import type { MessageInstance } from 'antd/es/message/interface'
import type { NotificationInstance } from 'antd/es/notification/interface'
import { useState } from 'react'
import type { Location, NavigateFunction } from 'react-router'
import { useLocation, useNavigate } from 'react-router'

import { useAuth } from '../context/AuthContext'
import type { Config } from '../context/ConfigContext'
import { useConfigContext } from '../context/ConfigContext'
import { useRoutesContext } from '../context/RoutesContext'
import type { ResourcesRefs, Widget, WidgetAction } from '../types/Widget'
import { useResolveJqExpression } from '../utils/jq-expression'

import { handleNavigateAction } from './actionHandlers/navigate.handler'
import { handleOpenDrawerAction } from './actionHandlers/openDrawer.handler'
import { handleOpenModalAction } from './actionHandlers/openModal.handler'
import { handleRestAction } from './actionHandlers/rest.handler'

export interface ActionHandlerContext {
  accessToken: string | null
  config: Config | undefined
  location: Location
  message: MessageInstance
  navigate: NavigateFunction
  notification: NotificationInstance
  queryClient: QueryClient
  reloadRoutes: () => Promise<void>
  resolveJq: (expression: string, values: Record<string, unknown>) => Promise<string>
  setIsActionLoading: (loading: boolean) => void
}

export const useHandleAction = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const { message, notification } = useApp()
  const { config } = useConfigContext()
  const { reloadRoutes } = useRoutesContext()
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false)
  const resolveJq = useResolveJqExpression()

  const handleAction = async (
    action: WidgetAction,
    resourcesRefs: ResourcesRefs,
    customPayload?: Record<string, unknown>,
    widget?: Widget
  ) => {
    if (action.loading?.display) {
      setIsActionLoading(true)
    }

    const context: ActionHandlerContext = {
      accessToken,
      config,
      location,
      message,
      navigate,
      notification,
      queryClient,
      reloadRoutes,
      resolveJq,
      setIsActionLoading,
    }

    try {
      switch (action.type) {
        case 'navigate':
          await handleNavigateAction(action, resourcesRefs, customPayload, widget, context)
          break
        case 'openDrawer':
          await handleOpenDrawerAction(action, resourcesRefs, customPayload, widget, context)
          break
        case 'openModal':
          await handleOpenModalAction(action, resourcesRefs, customPayload, widget, context)
          break
        case 'rest':
          await handleRestAction(action, resourcesRefs, customPayload, widget, context)
          break
      }
    } catch (error) {
      message.destroy()
      notification.error({
        description: `Unhandled error: ${JSON.stringify(error)}`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })
    } finally {
      setIsActionLoading(false)
    }
  }

  return { handleAction, isActionLoading }
}
