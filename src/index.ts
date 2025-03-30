#!/usr/bin/env node

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {createSimctlMcpServer} from './server.js'
import arg from 'arg'

const argSpec = {
  '--http': Boolean,
  '--port': Number,
  // 别名
  '-p': '--port'
} as const

type Args = arg.Result<typeof argSpec>

function parseArgs(): Args {
  try {
    return arg(argSpec)
  } catch (err: any) {
    console.error('Error parsing arguments:', err.message)
    process.exit(1)
  }
}

function getPort(args: Args): number {
  // 首先检查命令行参数
  if (args['--port'] != null) {
    return args['--port']
  }

  // 然后检查环境变量
  const envPort = process.env.PORT
  if (envPort) {
    const port = Number.parseInt(envPort)
    if (!Number.isNaN(port)) {
      return port
    }
  }

  // 默认端口
  return 8081
}

export async function startServer(): Promise<void> {
  const args = parseArgs()
  const server = createSimctlMcpServer()
  if (args['--http']) {
    const port = getPort(args)
    await server.startHttpServer(port)
    return
  }

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
