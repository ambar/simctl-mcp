#!/usr/bin/env node

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {createSimctlMcpServer} from './server.js'

export async function startServer(): Promise<void> {
  const isStdioMode = process.argv.includes('--stdio')
  const server = createSimctlMcpServer()
  if (isStdioMode) {
    const transport = new StdioServerTransport()
    await server.connect(transport)
  } else {
    await server.startHttpServer(8081)
  }
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
