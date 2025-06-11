# simctl-mcp

A Model Context Protocol server implementation for iOS Simulator control.

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=simctl-mcp&config=eyJjb21tYW5kIjoibnB4IC15IHNpbWN0bC1tY3AifQ%3D%3D)

## Config

`.cursor/mcp.json` or `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "simctl-mcp": {
      "command": "npx",
      "args": ["-y", "simctl-mcp"]
    }
  }
}
```

## Prompts

Some examples of prompts:

- What operations does the simulator support?
- Open shortcuts://
- What is the bundle ID of the "Settings" app?
- Set clipboard content to: Hello
- What is the simulator SDK version?
- Generate an Appium connection string for the "Settings" app

## Usage

The server can be started in two modes:

1. STDIO Mode (default)
2. HTTP Server Mode

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
