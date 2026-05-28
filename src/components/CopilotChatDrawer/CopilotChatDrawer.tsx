import { DeleteOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons'
import type { Message } from '@copilotkit/react-core/v2'
import { CopilotChat, useAgent } from '@copilotkit/react-core/v2'
import { Button, Flex, List, Popconfirm, Tooltip, Typography } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Thread = {
  id: string
  name: string
  createdAt: number
}

const THREADS_KEY = 'copilotkit_threads'
const MESSAGES_PREFIX = 'copilotkit_messages_'

const loadThreads = (): Thread[] => {
  try {
    return JSON.parse(localStorage.getItem(THREADS_KEY) ?? '[]') as Thread[]
  } catch {
    return []
  }
}

const saveThreads = (threads: Thread[]) =>
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads))

const loadMessages = (threadId: string): Message[] => {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_PREFIX + threadId) ?? '[]') as Message[]
  } catch {
    return []
  }
}

const saveMessages = (threadId: string, messages: Message[]) =>
  localStorage.setItem(MESSAGES_PREFIX + threadId, JSON.stringify(messages))

// Componente separato che ha accesso all'agent del thread attivo
type ThreadChatProps = {
  threadId: string
}

const ThreadChat = ({ threadId }: ThreadChatProps) => {
  const { agent } = useAgent({ agentId: 'memoryagent' })
  const restoredRef = useRef<string | null>(null)

  // Ripristina i messaggi quando cambia il threadId
  useEffect(() => {
    if (restoredRef.current === threadId) { return }
    restoredRef.current = threadId

    const stored = loadMessages(threadId)
    if (stored.length > 0) {
      agent.setMessages(stored)
    } else {
      agent.setMessages([])
    }
  }, [threadId, agent])

  // Salva i messaggi ad ogni aggiornamento
  useEffect(() => {
    if (!agent.messages?.length) { return }
    saveMessages(threadId, agent.messages)
  }, [threadId, agent.messages])

  return <CopilotChat style={{ height: '100%', width: '100%' }} threadId={threadId} />
}

type CopilotChatDrawerProps = {
  open: boolean
}

const CopilotChatDrawer = ({ open }: CopilotChatDrawerProps) => {
  const [threads, setThreads] = useState<Thread[]>(loadThreads)
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>()

  useEffect(() => {
    saveThreads(threads)
  }, [threads])

  const createThread = useCallback(() => {
    const thread: Thread = {
      createdAt: Date.now(),
      id: uuidv4(),
      name: `Conversazione ${threads.length + 1}`,
    }
    setThreads((prev) => [thread, ...prev])
    setActiveThreadId(thread.id)
  }, [threads.length])

  const deleteThread = (id: string) => {
    localStorage.removeItem(MESSAGES_PREFIX + id)
    setThreads((prev) => {
      const remaining = prev.filter((thread) => thread.id !== id)
      if (activeThreadId === id) {
        setActiveThreadId(remaining[0]?.id)
      }
      return remaining
    })
  }

  useEffect(() => {
    if (open && threads.length === 0) {
      createThread()
    }
  }, [createThread, open, threads.length])

  return (
    <Flex style={{ height: '100%' }}>
      <Flex
        style={{ borderRight: '1px solid #f0f0f0', overflow: 'hidden', width: 220 }}
        vertical
      >
        <Flex align='center' justify='space-between' style={{ padding: '8px 12px' }}>
          <Typography.Text strong>Conversazioni</Typography.Text>
          <Tooltip title='Nuova chat'>
            <Button icon={<PlusOutlined />} onClick={createThread} size='small' type='primary' />
          </Tooltip>
        </Flex>

        <List
          dataSource={threads}
          locale={{ emptyText: 'Nessuna conversazione' }}
          renderItem={(thread) => (
            <List.Item
              actions={[
                <Popconfirm
                  key='delete'
                  onConfirm={(event) => {
                    event?.stopPropagation()
                    deleteThread(thread.id)
                  }}
                  title='Eliminare questa conversazione?'
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(event) => event.stopPropagation()}
                    size='small'
                    type='text'
                  />
                </Popconfirm>,
              ]}
              onClick={() => setActiveThreadId(thread.id)}
              style={{
                background: activeThreadId === thread.id ? '#f5f5f5' : undefined,
                cursor: 'pointer',
                padding: '6px 12px',
              }}
            >
              <Flex align='center' gap={6}>
                <MessageOutlined style={{ color: '#999', fontSize: 12 }} />
                <Typography.Text ellipsis style={{ fontSize: 13, maxWidth: 120 }}>
                  {thread.name}
                </Typography.Text>
              </Flex>
            </List.Item>
          )}
          size='small'
          style={{ flex: 1, overflowY: 'auto' }}
        />
      </Flex>

      <Flex flex={1} style={{ overflow: 'hidden' }}>
        {activeThreadId && <ThreadChat threadId={activeThreadId} />}
      </Flex>
    </Flex>
  )
}

export default CopilotChatDrawer
