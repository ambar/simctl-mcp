import type {IncomingMessage, ServerResponse} from 'node:http'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {SSEServerTransport} from '@modelcontextprotocol/sdk/server/sse.js'
import type {Transport} from '@modelcontextprotocol/sdk/shared/transport.js'
import express, {type Request, type Response} from 'express'
import {Simctl} from 'node-simctl'
import {z} from 'zod'

const Logger = console

export function createSimctlMcpServer() {
  const server = new McpServer(
    {
      name: 'simctl-mcp-server',
      version: '0.0.1',
    },
    {
      capabilities: {
        logging: {},
        tools: {},
      },
    },
  )

  let sseTransport: SSEServerTransport | null = null

  // 创建新设备
  server.tool(
    'create_device',
    '创建一个新的模拟器设备',
    {
      name: z.string().describe('设备名称'),
      runtime: z.string().describe('运行时版本'),
      deviceType: z.string().describe('设备类型'),
    },
    async ({name, runtime, deviceType}) => {
      try {
        const simctl = new Simctl()
        const device = await simctl.createDevice(name, runtime, deviceType)
        return {
          content: [{type: 'text', text: JSON.stringify(device)}],
        }
      } catch (error) {
        Logger.error(`创建设备失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `创建设备失败: ${error}`}],
        }
      }
    },
  )

  // 删除设备
  server.tool(
    'delete_device',
    '删除指定的模拟器设备',
    {
      udid: z.string().describe('设备的唯一标识符'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.deleteDevice()
        return {
          content: [{type: 'text', text: '设备删除成功'}],
        }
      } catch (error) {
        Logger.error(`删除设备失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `删除设备失败: ${error}`}],
        }
      }
    },
  )

  // 启动设备
  server.tool(
    'boot_device',
    '启动模拟器设备',
    {
      udid: z.string().describe('设备的唯一标识符'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.bootDevice()
        return {
          content: [{type: 'text', text: '设备启动成功'}],
        }
      } catch (error) {
        Logger.error(`启动设备失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `启动设备失败: ${error}`}],
        }
      }
    },
  )

  // 关闭设备
  server.tool(
    'shutdown_device',
    '关闭模拟器设备',
    {
      udid: z.string().describe('设备的唯一标识符'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.shutdownDevice()
        return {
          content: [{type: 'text', text: '设备关闭成功'}],
        }
      } catch (error) {
        Logger.error(`关闭设备失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `关闭设备失败: ${error}`}],
        }
      }
    },
  )

  // 获取环境变量
  server.tool(
    'get_env',
    '获取设备的环境变量',
    {
      udid: z.string().describe('设备的唯一标识符'),
      key: z.string().describe('环境变量的键名'),
    },
    async ({udid, key}) => {
      try {
        const simctl = new Simctl({udid})
        const value = await simctl.getEnv(key)
        return {
          content: [{type: 'text', text: value}],
        }
      } catch (error) {
        Logger.error(`获取环境变量失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `获取环境变量失败: ${error}`}],
        }
      }
    },
  )

  // 打开 URL
  server.tool(
    'open_url',
    '在设备中打开 URL',
    {
      udid: z.string().describe('设备的唯一标识符'),
      url: z.string().describe('要打开的 URL'),
    },
    async ({udid, url}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.openUrl(url)
        return {
          content: [{type: 'text', text: 'URL 打开成功'}],
        }
      } catch (error) {
        Logger.error(`打开 URL 失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `打开 URL 失败: ${error}`}],
        }
      }
    },
  )

  // 添加媒体文件
  server.tool(
    'add_media',
    '向设备添加媒体文件',
    {
      udid: z.string().describe('设备的唯一标识符'),
      paths: z.array(z.string()).describe('媒体文件路径列表'),
    },
    async ({udid, paths}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.addMedia(paths)
        return {
          content: [{type: 'text', text: '媒体文件添加成功'}],
        }
      } catch (error) {
        Logger.error(`添加媒体文件失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `添加媒体文件失败: ${error}`}],
        }
      }
    },
  )

  // 安装应用
  server.tool(
    'install_app',
    '在设备上安装应用',
    {
      udid: z.string().describe('设备的唯一标识符'),
      path: z.string().describe('应用文件路径'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.installApp(path)
        return {
          content: [{type: 'text', text: '应用安装成功'}],
        }
      } catch (error) {
        Logger.error(`安装应用失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `安装应用失败: ${error}`}],
        }
      }
    },
  )

  // 卸载应用
  server.tool(
    'uninstall_app',
    '从设备上卸载应用',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.uninstallApp(bundleId)
        return {
          content: [{type: 'text', text: '应用卸载成功'}],
        }
      } catch (error) {
        Logger.error(`卸载应用失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `卸载应用失败: ${error}`}],
        }
      }
    },
  )

  // 获取应用容器路径
  server.tool(
    'get_app_container',
    '获取已安装应用的容器路径',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        const path = await simctl.getAppContainer(bundleId)
        return {
          content: [{type: 'text', text: path}],
        }
      } catch (error) {
        Logger.error(`获取应用容器路径失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `获取应用容器路径失败: ${error}`}],
        }
      }
    },
  )

  // 启动应用
  server.tool(
    'launch_app',
    '在设备上启动应用',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.launchApp(bundleId)
        return {
          content: [{type: 'text', text: '应用启动成功'}],
        }
      } catch (error) {
        Logger.error(`启动应用失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `启动应用失败: ${error}`}],
        }
      }
    },
  )

  // 终止应用
  server.tool(
    'terminate_app',
    '终止设备上运行的应用',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.terminateApp(bundleId)
        return {
          content: [{type: 'text', text: '应用终止成功'}],
        }
      } catch (error) {
        Logger.error(`终止应用失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `终止应用失败: ${error}`}],
        }
      }
    },
  )

  // 获取设备列表
  server.tool('list_devices', '获取可用的模拟器设备列表', {}, async () => {
    try {
      const simctl = new Simctl()
      const devices = await simctl.getDevices()
      return {
        content: [{type: 'text', text: JSON.stringify(devices)}],
      }
    } catch (error) {
      Logger.error(`获取设备列表失败: ${error}`)
      return {
        isError: true,
        content: [{type: 'text', text: `获取设备列表失败: ${error}`}],
      }
    }
  })

  // 获取设备类型列表
  server.tool('list_device_types', '获取可用的设备类型列表', {}, async () => {
    try {
      const simctl = new Simctl()
      const deviceTypes = await simctl.getDeviceTypes()
      return {
        content: [{type: 'text', text: JSON.stringify(deviceTypes)}],
      }
    } catch (error) {
      Logger.error(`获取设备类型列表失败: ${error}`)
      return {
        isError: true,
        content: [{type: 'text', text: `获取设备类型列表失败: ${error}`}],
      }
    }
  })

  // 获取运行时列表
  server.tool('list_runtimes', '获取可用的运行时列表', {}, async () => {
    try {
      const simctl = new Simctl()
      const runtimes = await simctl.list()
      return {
        content: [{type: 'text', text: JSON.stringify(runtimes)}],
      }
    } catch (error) {
      Logger.error(`获取运行时列表失败: ${error}`)
      return {
        isError: true,
        content: [{type: 'text', text: `获取运行时列表失败: ${error}`}],
      }
    }
  })

  // 获取应用信息
  server.tool(
    'get_app_info',
    '获取已安装应用的信息',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        const info = await simctl.appInfo(bundleId)
        return {
          content: [{type: 'text', text: JSON.stringify(info)}],
        }
      } catch (error) {
        Logger.error(`获取应用信息失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `获取应用信息失败: ${error}`}],
        }
      }
    },
  )

  // 获取设备外观设置
  server.tool(
    'get_appearance',
    '获取设备的外观设置',
    {
      udid: z.string().describe('设备的唯一标识符'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        const appearance = await simctl.getAppearance()
        return {
          content: [{type: 'text', text: appearance}],
        }
      } catch (error) {
        Logger.error(`获取外观设置失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `获取外观设置失败: ${error}`}],
        }
      }
    },
  )

  // 设置设备外观
  server.tool(
    'set_appearance',
    '设置设备的外观',
    {
      udid: z.string().describe('设备的唯一标识符'),
      appearance: z.string().describe('外观设置 (light/dark)'),
    },
    async ({udid, appearance}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.setAppearance(appearance)
        return {
          content: [{type: 'text', text: '外观设置成功'}],
        }
      } catch (error) {
        Logger.error(`设置外观失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `设置外观失败: ${error}`}],
        }
      }
    },
  )

  // 发送推送通知
  server.tool(
    'push_notification',
    '向设备发送模拟推送通知',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
      payload: z.string().describe('推送通知的 JSON 负载'),
    },
    async ({udid, bundleId, payload}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.pushNotification(bundleId, JSON.parse(payload))
        return {
          content: [{type: 'text', text: '推送通知发送成功'}],
        }
      } catch (error) {
        Logger.error(`发送推送通知失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `发送推送通知失败: ${error}`}],
        }
      }
    },
  )

  // 授予权限
  server.tool(
    'grant_permission',
    '向应用授予权限',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
      permission: z.string().describe('权限类型'),
    },
    async ({udid, bundleId, permission}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.grantPermission(bundleId, permission)
        return {
          content: [{type: 'text', text: '权限授予成功'}],
        }
      } catch (error) {
        Logger.error(`授予权限失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `授予权限失败: ${error}`}],
        }
      }
    },
  )

  // 撤销权限
  server.tool(
    'revoke_permission',
    '撤销应用的权限',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
      permission: z.string().describe('权限类型'),
    },
    async ({udid, bundleId, permission}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.revokePermission(bundleId, permission)
        return {
          content: [{type: 'text', text: '权限撤销成功'}],
        }
      } catch (error) {
        Logger.error(`撤销权限失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `撤销权限失败: ${error}`}],
        }
      }
    },
  )

  // 重置权限
  server.tool(
    'reset_permission',
    '重置应用的所有权限',
    {
      udid: z.string().describe('设备的唯一标识符'),
      bundleId: z.string().describe('应用的 Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.resetPermission(bundleId)
        return {
          content: [{type: 'text', text: '权限重置成功'}],
        }
      } catch (error) {
        Logger.error(`重置权限失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `重置权限失败: ${error}`}],
        }
      }
    },
  )

  // 添加根证书
  server.tool(
    'add_root_certificate',
    '向设备的钥匙串添加根证书',
    {
      udid: z.string().describe('设备的唯一标识符'),
      path: z.string().describe('证书文件路径'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.addRootCertificate(path)
        return {
          content: [{type: 'text', text: '根证书添加成功'}],
        }
      } catch (error) {
        Logger.error(`添加根证书失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `添加根证书失败: ${error}`}],
        }
      }
    },
  )

  // 添加证书
  server.tool(
    'add_certificate',
    '向设备的钥匙串添加证书',
    {
      udid: z.string().describe('设备的唯一标识符'),
      path: z.string().describe('证书文件路径'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.addCertificate(path)
        return {
          content: [{type: 'text', text: '证书添加成功'}],
        }
      } catch (error) {
        Logger.error(`添加证书失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `添加证书失败: ${error}`}],
        }
      }
    },
  )

  // 重置钥匙串
  server.tool(
    'reset_keychain',
    '重置设备的钥匙串',
    {
      udid: z.string().describe('设备的唯一标识符'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.resetKeychain()
        return {
          content: [{type: 'text', text: '钥匙串重置成功'}],
        }
      } catch (error) {
        Logger.error(`重置钥匙串失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `重置钥匙串失败: ${error}`}],
        }
      }
    },
  )

  // 获取设备截图
  server.tool(
    'get_screenshot',
    '获取设备的截图',
    {
      udid: z.string().describe('设备的唯一标识符'),
      path: z.string().describe('截图保存路径'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        const r = await simctl.exec('io', {
          args: [udid, 'screenshot', path],
        })
        return {
          content: [{type: 'text', text: r.stdout || r.stderr}],
        }
      } catch (error) {
        Logger.error(`获取截图失败: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `获取截图失败: ${error}`}],
        }
      }
    },
  )

  return {
    async connect(transport: Transport): Promise<void> {
      await server.connect(transport)
    },

    async startHttpServer(port: number): Promise<void> {
      const app = express()

      app.get('/sse', async (req: Request, res: Response) => {
        console.log('New SSE connection established')
        sseTransport = new SSEServerTransport(
          '/messages',
          res as unknown as ServerResponse<IncomingMessage>,
        )
        await server.connect(sseTransport)
      })

      app.post('/messages', async (req: Request, res: Response) => {
        if (!sseTransport) {
          res.sendStatus(400)
          return
        }
        await sseTransport.handlePostMessage(
          req as unknown as IncomingMessage,
          res as unknown as ServerResponse<IncomingMessage>,
        )
      })

      app.listen(port, () => {
        Logger.log(`HTTP server listening on port ${port}`)
        Logger.log(`SSE endpoint available at http://localhost:${port}/sse`)
        Logger.log(
          `Message endpoint available at http://localhost:${port}/messages`,
        )
      })
    },
  }
}
