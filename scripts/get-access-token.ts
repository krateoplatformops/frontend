import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { api } from '../public/config/config.json'

const adminUsername = process.env.ADMIN_USERNAME
if (!adminUsername) {
  throw new Error('ADMIN_USERNAME env is not set')
}
const adminPassword = process.env.ADMIN_PASSWORD
if (!adminPassword) {
  throw new Error('ADMIN_PASSWORD env is not set')
}

// curl 'http://20.166.174.117:8082/basic/login' \
//   -H 'authorization: Basic YWRtaW46TlFwTFNicXRjRkdE' \
//   --insecure

// echo -n 'admin:NQpLSbqtcFGD' | base64
export async function getAccessToken() {
  const credentials = Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64')

  const response = await fetch(`${api.AUTHN_API_BASE_URL}/basic/login`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json() as unknown
  writeFileSync(join(process.cwd(), 'scripts', 'login-response.json'), JSON.stringify(data, null, 2))
}

void getAccessToken()
