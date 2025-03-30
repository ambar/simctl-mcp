# simctl-mcp

A Model Context Protocol server implementation for iOS Simulator control.

## Config

`.cursor/mcp.json` or `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "simctl-mcp": {
      "command": "npx",
      "args": ["simctl-mcp"]
    }
  }
}
```

## Usage

The server can be started in two modes:

1. HTTP Server Mode (default)
2. STDIO Mode

### STDIO Mode

In STDIO mode, the server communicates through standard input/output streams.

```bash
npx simctl-mcp
```

### HTTP Server Mode

In HTTP server mode, the server listens for HTTP connections on a specified port.

```bash
# Start with default port (8081)
npx simctl-mcp --http

# Start with custom port using --port flag
npx simctl-mcp --http --port 3000

# Start with custom port using environment variable
PORT=3000 npx simctl-mcp --http
```

## Tools

Based on the code, I can help you with the following iOS simulator operations:

## Device Management:
- Create new simulator devices
- Delete existing devices
- Boot devices
- Shutdown devices
- List all available devices
- List available device types
- List available runtimes

## App Management:
- Install apps
- Uninstall apps
- Launch apps
- Terminate running apps
- Get app container path
- Get app information
- List installed apps

## App Permissions:
- Grant permissions to apps
- Revoke app permissions
- Reset all app permissions

## System Features:
- Open URLs in simulator
- Add media files
- Get/Set environment variables
- Get/Set appearance (light/dark mode)
- Send simulated push notifications

## Certificate & Security:
- Add root certificates
- Add regular certificates
- Reset keychain

## Media & Content:
- Take screenshots
- Get/Set pasteboard content (clipboard)
