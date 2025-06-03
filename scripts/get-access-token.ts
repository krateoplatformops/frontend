// curl 'http://20.166.174.117:8082/basic/login' \
//   -H 'authorization: Basic YWRtaW46TlFwTFNicXRjRkdE' \
//   --insecure

// echo -n 'admin:NQpLSbqtcFGD' | base64

const adminUsername = 'admin'
const adminPassword = 'zzXeMF8aTitj'

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { api } from '../public/config/config.json'

export async function getAccessToken() {
  const credentials = Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64')

  const response = await fetch(`${api.AUTHN_API_BASE_URL}/basic/login`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  writeFileSync(join(process.cwd(), 'scripts', 'login-response.json'), JSON.stringify(data, null, 2))
}

getAccessToken()
