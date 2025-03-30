# simctl-mcp

A Model Context Protocol server implementation for iOS Simulator control.

## Config

`.cursor/mcp.json` or `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "simctl-mcp-sse": {
      "url": "http://localhost:8081/sse"
    },
    "simctl-mcp-stdio": {
      "command": "npx",
      "args": ["simctl-mcp", "--stdio"]
    }
  }
}
```

## Usage

The server can be started in two modes:

1. HTTP Server Mode (default)
2. STDIO Mode

### HTTP Server Mode

In HTTP server mode, the server listens for HTTP connections on a specified port.

```bash
# Start with default port (8081)
npx simctl-mcp

# Start with custom port using --port flag
npx simctl-mcp --port 3000

# Start with custom port using environment variable
PORT=3000 npx simctl-mcp
```

### STDIO Mode

In STDIO mode, the server communicates through standard input/output streams.

```bash
npx simctl-mcp --stdio
```


## Tools

Device Management:
1. Create simulator device: Create a new simulator with specified name, runtime, and device type
2. Delete simulator device: Remove a simulator by its UDID
3. Boot/Shutdown device: Control simulator power state
4. List devices, device types, and runtimes: Get information about available simulators

App Management:
1. Install/Uninstall apps
2. Launch/Terminate apps
3. Get app container path and app info
4. Open URLs in simulator

Device Configuration:
1. Environment variables: Get device environment variables
2. Appearance settings: Get/Set light/dark mode
3. Permissions: Grant/Revoke/Reset app permissions
4. Keychain: Add certificates and reset keychain

Media & Testing:
1. Add media files to simulator
2. Send push notifications
3. Take screenshots
4. Add test certificates
