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

  // Create new device
  server.tool(
    'create_device',
    'Create a new simulator device',
    {
      name: z.string().describe('Device name'),
      runtime: z.string().describe('Runtime version'),
      deviceType: z.string().describe('Device type'),
    },
    async ({name, runtime, deviceType}) => {
      try {
        const simctl = new Simctl()
        const device = await simctl.createDevice(name, runtime, deviceType)
        return {
          content: [{type: 'text', text: JSON.stringify(device)}],
        }
      } catch (error) {
        Logger.error(`Failed to create device: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to create device: ${error}`}],
        }
      }
    },
  )

  // Delete device
  server.tool(
    'delete_device',
    'Delete the specified simulator device',
    {
      udid: z.string().describe('Device unique identifier'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.deleteDevice()
        return {
          content: [{type: 'text', text: 'Device deleted successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to delete device: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to delete device: ${error}`}],
        }
      }
    },
  )

  // Boot device
  server.tool(
    'boot_device',
    'Boot simulator device',
    {
      udid: z.string().describe('Device unique identifier'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.bootDevice()
        return {
          content: [{type: 'text', text: 'Device booted successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to boot device: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to boot device: ${error}`}],
        }
      }
    },
  )

  // Shutdown device
  server.tool(
    'shutdown_device',
    'Shutdown simulator device',
    {
      udid: z.string().describe('Device unique identifier'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.shutdownDevice()
        return {
          content: [{type: 'text', text: 'Device shutdown successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to shutdown device: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to shutdown device: ${error}`}],
        }
      }
    },
  )

  // Get environment variable
  server.tool(
    'get_env',
    'Get device environment variable',
    {
      udid: z.string().describe('Device unique identifier'),
      key: z.string().describe('Environment variable key'),
    },
    // @ts-expect-error skip
    async ({udid, key}) => {
      try {
        const simctl = new Simctl({udid})
        const value = await simctl.getEnv(key)
        return {
          content: [{type: 'text', text: value}],
        }
      } catch (error) {
        Logger.error(`Failed to get environment variable: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to get environment variable: ${error}`}],
        }
      }
    },
  )

  // Open URL
  server.tool(
    'open_url',
    'Open URL in device',
    {
      udid: z.string().describe('Device unique identifier'),
      url: z.string().describe('URL to open'),
    },
    async ({udid, url}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.openUrl(url)
        return {
          content: [{type: 'text', text: 'URL opened successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to open URL: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to open URL: ${error}`}],
        }
      }
    },
  )

  // Add media
  server.tool(
    'add_media',
    'Add media files to device',
    {
      udid: z.string().describe('Device unique identifier'),
      path: z.string().describe('Media file path'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.addMedia(path)
        return {
          content: [{type: 'text', text: 'Media files added successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to add media files: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to add media files: ${error}`}],
        }
      }
    },
  )

  // Install app
  server.tool(
    'install_app',
    'Install app on device',
    {
      udid: z.string().describe('Device unique identifier'),
      path: z.string().describe('App file path'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.installApp(path)
        return {
          content: [{type: 'text', text: 'App installed successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to install app: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to install app: ${error}`}],
        }
      }
    },
  )

  // Uninstall app
  server.tool(
    'uninstall_app',
    'Uninstall app from device',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.uninstallApp(bundleId)
        return {
          content: [{type: 'text', text: 'App uninstalled successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to uninstall app: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to uninstall app: ${error}`}],
        }
      }
    },
  )

  // Get app container
  server.tool(
    'get_app_container',
    'Get installed app container path',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        const path = await simctl.getAppContainer(bundleId)
        return {
          content: [{type: 'text', text: path}],
        }
      } catch (error) {
        Logger.error(`Failed to get app container path: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to get app container path: ${error}`}],
        }
      }
    },
  )

  // Launch app
  server.tool(
    'launch_app',
    'Launch app on device',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.launchApp(bundleId)
        return {
          content: [{type: 'text', text: 'App launched successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to launch app: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to launch app: ${error}`}],
        }
      }
    },
  )

  // Terminate app
  server.tool(
    'terminate_app',
    'Terminate running app on device',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.terminateApp(bundleId)
        return {
          content: [{type: 'text', text: 'App terminated successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to terminate app: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to terminate app: ${error}`}],
        }
      }
    },
  )

  // List devices
  server.tool('list_devices', 'List available simulator devices', {}, async () => {
    try {
      const simctl = new Simctl()
      const devices = await simctl.getDevices()
      return {
        content: [{type: 'text', text: JSON.stringify(devices)}],
      }
    } catch (error) {
      Logger.error(`Failed to get device list: ${error}`)
      return {
        isError: true,
        content: [{type: 'text', text: `Failed to get device list: ${error}`}],
      }
    }
  })

  // List device types
  server.tool('list_device_types', 'List available device types', {}, async () => {
    try {
      const simctl = new Simctl()
      const deviceTypes = await simctl.getDeviceTypes()
      return {
        content: [{type: 'text', text: JSON.stringify(deviceTypes)}],
      }
    } catch (error) {
      Logger.error(`Failed to get device types: ${error}`)
      return {
        isError: true,
        content: [{type: 'text', text: `Failed to get device types: ${error}`}],
      }
    }
  })

  // List runtimes
  server.tool('list_runtimes', 'List available runtimes', {}, async () => {
    try {
      const simctl = new Simctl()
      const runtimes = await simctl.list()
      return {
        content: [{type: 'text', text: JSON.stringify(runtimes)}],
      }
    } catch (error) {
      Logger.error(`Failed to get runtimes: ${error}`)
      return {
        isError: true,
        content: [{type: 'text', text: `Failed to get runtimes: ${error}`}],
      }
    }
  })

  // Get app info
  server.tool(
    'get_app_info',
    'Get installed app information',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
    },
    async ({udid, bundleId}) => {
      try {
        const simctl = new Simctl({udid})
        const info = await simctl.appInfo(bundleId)
        return {
          content: [{type: 'text', text: JSON.stringify(info)}],
        }
      } catch (error) {
        Logger.error(`Failed to get app info: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to get app info: ${error}`}],
        }
      }
    },
  )

  // Get appearance
  server.tool(
    'get_appearance',
    'Get device appearance settings',
    {
      udid: z.string().describe('Device unique identifier'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        const appearance = await simctl.getAppearance()
        return {
          content: [{type: 'text', text: appearance}],
        }
      } catch (error) {
        Logger.error(`Failed to get appearance: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to get appearance: ${error}`}],
        }
      }
    },
  )

  // Set appearance
  server.tool(
    'set_appearance',
    'Set device appearance',
    {
      udid: z.string().describe('Device unique identifier'),
      appearance: z.string().describe('Appearance setting (light/dark)'),
    },
    async ({udid, appearance}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.setAppearance(appearance)
        return {
          content: [{type: 'text', text: 'Appearance set successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to set appearance: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to set appearance: ${error}`}],
        }
      }
    },
  )

  // Push notification
  server.tool(
    'push_notification',
    'Send simulated push notification to device',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
      payload: z.string().describe('Push notification JSON payload'),
    },
    async ({udid, bundleId, payload}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.pushNotification(bundleId, JSON.parse(payload))
        return {
          content: [{type: 'text', text: 'Push notification sent successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to send push notification: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to send push notification: ${error}`}],
        }
      }
    },
  )

  // Grant permission
  server.tool(
    'grant_permission',
    'Grant permission to app',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
      permission: z.string().describe('Permission type'),
    },
    async ({udid, bundleId, permission}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.grantPermission(bundleId, permission)
        return {
          content: [{type: 'text', text: 'Permission granted successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to grant permission: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to grant permission: ${error}`}],
        }
      }
    },
  )

  // Revoke permission
  server.tool(
    'revoke_permission',
    'Revoke app permission',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
      permission: z.string().describe('Permission type'),
    },
    async ({udid, bundleId, permission}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.revokePermission(bundleId, permission)
        return {
          content: [{type: 'text', text: 'Permission revoked successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to revoke permission: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to revoke permission: ${error}`}],
        }
      }
    },
  )

  // Reset permission
  server.tool(
    'reset_permission',
    'Reset all app permissions',
    {
      udid: z.string().describe('Device unique identifier'),
      bundleId: z.string().describe('App Bundle ID'),
      permission: z.string().describe('Permission type'),
    },
    async ({udid, bundleId, permission}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.resetPermission(bundleId, permission)
        return {
          content: [{type: 'text', text: 'Permissions reset successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to reset permissions: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to reset permissions: ${error}`}],
        }
      }
    },
  )

  // Add root certificate
  server.tool(
    'add_root_certificate',
    'Add root certificate to device keychain',
    {
      udid: z.string().describe('Device unique identifier'),
      path: z.string().describe('Certificate file path'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.addRootCertificate(path)
        return {
          content: [{type: 'text', text: 'Root certificate added successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to add root certificate: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to add root certificate: ${error}`}],
        }
      }
    },
  )

  // Add certificate
  server.tool(
    'add_certificate',
    'Add certificate to device keychain',
    {
      udid: z.string().describe('Device unique identifier'),
      path: z.string().describe('Certificate file path'),
    },
    async ({udid, path}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.addCertificate(path)
        return {
          content: [{type: 'text', text: 'Certificate added successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to add certificate: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to add certificate: ${error}`}],
        }
      }
    },
  )

  // Reset keychain
  server.tool(
    'reset_keychain',
    'Reset device keychain',
    {
      udid: z.string().describe('Device unique identifier'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        await simctl.resetKeychain()
        return {
          content: [{type: 'text', text: 'Keychain reset successfully'}],
        }
      } catch (error) {
        Logger.error(`Failed to reset keychain: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to reset keychain: ${error}`}],
        }
      }
    },
  )

  // Get screenshot
  server.tool(
    'get_screenshot',
    'Get device screenshot',
    {
      udid: z.string().describe('Device unique identifier'),
      path: z.string().describe('Screenshot save path'),
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
        Logger.error(`Failed to get screenshot: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to get screenshot: ${error}`}],
        }
      }
    },
  )

  // List apps
  server.tool(
    'list_apps',
    'List installed apps on device',
    {
      udid: z.string().describe('Device unique identifier'),
    },
    async ({udid}) => {
      try {
        const simctl = new Simctl({udid})
        const r = await simctl.exec('listapps', {
          args: [udid],
        })
        return {
          content: [{type: 'text', text: r.stdout || r.stderr}],
        }
      } catch (error) {
        Logger.error(`Failed to list apps: ${error}`)
        return {
          isError: true,
          content: [{type: 'text', text: `Failed to list apps: ${error}`}],
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
