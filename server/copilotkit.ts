import { HttpAgent } from '@ag-ui/client'
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime'
import cors from 'cors'
import express from 'express'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/copilotkit', async (req, res) => {
  const serviceAdapter = new ExperimentalEmptyAdapter()

  const runtime = new CopilotRuntime({
    agents: {
      memoryagent: new HttpAgent({ url: 'http://localhost:8000/' }),
    },
  })

  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: '/api/copilotkit',
    runtime,
    serviceAdapter,
  })

  return handler(req, res)
})

app.listen(3001, () => {
  console.log('CopilotKit runtime listening on http://localhost:3001')
})
