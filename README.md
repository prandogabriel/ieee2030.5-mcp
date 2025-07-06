# IEEE 2030.5 MCP Server

A Model Context Protocol (MCP) server for interacting with IEEE 2030.5 (SEP 2.0) Smart Energy Profile servers.

[![npm version](https://badge.fury.io/js/@prandogabriel%2Fieee2030.5-mcp.svg)](https://badge.fury.io/js/@prandogabriel%2Fieee2030.5-mcp)
[![License](https://img.shields.io/badge/License-BY--NC--SA--4.0-blue.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**Quick Start:** `npx -y @prandogabriel/ieee2030.5-mcp`

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
  - [System Requirements](#system-requirements)
  - [Install Node.js](#install-nodejs)
  - [Install pnpm](#install-pnpm)
  - [IEEE 2030.5 Server Requirements](#ieee-20305-server-requirements)
- [Quick Start](#quick-start)
  - [Option 1: Using Published Package (Fastest)](#option-1-using-published-package-fastest)
  - [Option 2: Local Development Setup](#option-2-local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Available MCP Tools](#available-mcp-tools)
  - [Connection & Status Tools](#connection--status-tools)
  - [IEEE 2030.5 Resource Tools](#ieee-20305-resource-tools)
  - [Available MCP Prompts](#available-mcp-prompts)
- [IEEE 2030.5 Navigation](#ieee-20305-navigation)
- [Development](#development)
  - [Development Dependencies](#development-dependencies)
  - [Development Commands](#development-commands)
  - [Development Workflow](#development-workflow)
- [Usage Examples](#usage-examples)
  - [Using Published Package (Recommended)](#using-published-package-recommended)
  - [Using with Claude Desktop (Local Development)](#using-with-claude-desktop-local-development)
  - [Using MCP Inspector](#using-mcp-inspector)
  - [Programmatic Usage](#programmatic-usage)
- [Contributing](#contributing)
  - [Getting Started](#getting-started)
  - [Development Guidelines](#development-guidelines)
  - [Areas for Contribution](#areas-for-contribution)
  - [Contribution Workflow](#contribution-workflow)
  - [Architecture Overview](#architecture-overview)
  - [Community Guidelines](#community-guidelines)
  - [Getting Help](#getting-help)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Features

- 🔐 Certificate-based authentication (single .pem or separate cert/key files)
- 📡 Full IEEE 2030.5 endpoint support
- 🛠️ MCP tools for all major IEEE 2030.5 resources
- 🎯 HATEOAS-based navigation with comprehensive guide
- ⚙️ Environment-based configuration
- 🧪 Built-in test client and MCP Inspector support

## Prerequisites

### System Requirements

- **Node.js**: Version 20.0.0 or higher
- **Package Manager**: pnpm (recommended) or npm
- **Operating System**: macOS, Linux, or Windows

### Install Node.js

If you don't have Node.js installed:

**Using Node Version Manager (recommended):**
```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

**Direct download:**
- Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)

### Install pnpm

```bash
npm install -g pnpm
```

Or using corepack (Node.js 16.10+):
```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### IEEE 2030.5 Server Requirements

To use this MCP server, you need access to an IEEE 2030.5 compliant server with:

- **HTTPS endpoint** (typically port 8443)
- **Client certificate authentication** (.pem format recommended)
- **IEEE 2030.5/SEP 2.0 compliance** with standard endpoints

**Common IEEE 2030.5 implementations:**
- OpenADR VEN/VTN servers
- Smart inverter management systems
- Utility demand response platforms
- Distributed Energy Resource (DER) management systems

## Quick Start

### Option 1: Using Published Package (Fastest)

For most users, the simplest way is to use the published npm package:

1. **Ensure Node.js 20+ is installed**:
   ```bash
   node --version  # Should be 20.0.0 or higher
   ```

2. **Test the server**:
   ```bash
   npx -y @prandogabriel/ieee2030.5-mcp
   ```

3. **Configure with Claude Desktop** - see [Published Package Configuration](#using-published-package-recommended)

### Option 2: Local Development Setup

For development or customization:

### 1. Verify Requirements

Check your Node.js and pnpm versions:

```bash
node --version  # Should be 20.0.0 or higher
pnpm --version  # Should be 8.0.0 or higher
```

### 2. Clone and Install

```bash
git clone <repository-url>
cd ieee2030.5-mcp
pnpm install
```

### 3. Configure Environment

Copy the example environment file and configure your IEEE 2030.5 server:

```bash
cp .env.example .env
```

Edit `.env` with your configuration. The server will automatically load environment variables from the `.env` file:

```bash
# REQUIRED: Your IEEE 2030.5 server URL
IEEE2030_BASE_URL=https://your-ieee2030-server:port

# REQUIRED: Certificate for authentication (choose one option)
# Option 1: Single PEM file (like curl -E $CTRL_CERT)
IEEE2030_CERT_PATH=/path/to/your/client.pem

# Option 2: Separate files
# IEEE2030_CERT_PATH=/path/to/client.crt
# IEEE2030_KEY_PATH=/path/to/client.key

# Optional: Security settings
IEEE2030_INSECURE=true  # Set to true for development with self-signed certs
```

**Note:** The `.env` file is automatically ignored by git for security.

### 4. Build the Project

```bash
pnpm build
```

### 5. Test the Server

Use the MCP Inspector for interactive testing and debugging:

```bash
# Build and start the inspector
pnpm debug
```

This will:
1. Build your server
2. Open the MCP Inspector in your browser at `http://localhost:5173`
3. Connect to your IEEE 2030.5 MCP server

The inspector provides a web UI where you can:
- View all available tools
- Test tools interactively with parameters
- See real-time responses and errors
- Debug your server behavior

## Environment Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `IEEE2030_BASE_URL` | Base URL of your IEEE 2030.5 server | ✅ Yes |
| `IEEE2030_CERT_PATH` | Path to certificate file (.pem, .crt) | ✅ One of cert options |
| `IEEE2030_CERT_VALUE` | Certificate content as string | ✅ One of cert options |
| `IEEE2030_KEY_PATH` | Path to private key file (if separate) | ❌ Optional |
| `IEEE2030_KEY_VALUE` | Private key content as string | ❌ Optional |
| `IEEE2030_INSECURE` | Skip SSL verification (dev only) | ❌ Default: false |
| `IEEE2030_TIMEOUT` | Request timeout in milliseconds | ❌ Default: 30000 |

## Available MCP Tools

### Connection & Status Tools
- `ieee2030_status` - Check client configuration status
- `ieee2030_test_connection` - Test connectivity to IEEE 2030.5 server

### IEEE 2030.5 Resource Tools
- `ieee2030_get_device_capabilities` - Get device capabilities (/dcap) - **Start here for resource discovery**
- `ieee2030_get_end_devices` - Get end devices (/edev) - Physical devices and their DERs
- `ieee2030_get_der_programs` - Get DER programs (/derp) - Control programs for DERs
- `ieee2030_get_demand_response_programs` - Get demand response programs (/drp)
- `ieee2030_get_usage_points` - Get usage points (/upt) - Metering locations
- `ieee2030_get_time` - Get server time (/tm) - Server time synchronization
- `ieee2030_get_custom_endpoint` - Access any custom endpoint with dynamic navigation

### Available MCP Prompts

- `ieee2030_navigation_guide` - Comprehensive guide for navigating IEEE 2030.5 resources using HATEOAS principles

## IEEE 2030.5 Navigation

This MCP server includes a comprehensive navigation guide that teaches you how to explore IEEE 2030.5 resources dynamically. The IEEE 2030.5 standard uses HATEOAS (Hypermedia as the Engine of Application State) principles, where each response contains links to related resources.

**Key Navigation Tips:**
1. **Always start with** `/dcap` (Device Capabilities) to discover available resources
2. **Follow links dynamically** - use the `href` attributes in responses to navigate
3. **Use the custom endpoint tool** to access any discovered path
4. **Check the navigation guide prompt** for detailed examples and patterns

## Development

### Development Dependencies

This project uses modern development tools:

- **TypeScript**: Type-safe JavaScript development
- **esbuild**: Fast bundling and compilation
- **Biome**: Fast linting and formatting (replaces ESLint + Prettier)
- **nodemon**: Auto-restart during development
- **MCP Inspector**: Interactive testing and debugging

### Development Commands

```bash
# Start development server with auto-reload
pnpm dev

# Run linting and formatting
pnpm lint          # Check for issues
pnpm lint:fix      # Fix issues automatically
pnpm format        # Check formatting
pnpm format:fix    # Fix formatting
pnpm check         # Run both lint and format checks
pnpm check:fix     # Fix both lint and format issues

# Build for production
pnpm build

# Start production server
pnpm start

# Development with auto-restart
pnpm watch
```

### Development Workflow

1. **Make changes** to source code in `/src`
2. **Run development server**: `pnpm dev`
3. **Test with MCP Inspector**: `pnpm debug`
4. **Format and lint**: `pnpm check:fix`
5. **Build for production**: `pnpm build`

## Usage Examples

### Using Published Package (Recommended)

The easiest way to use this MCP server is through the published npm package. No need to clone or build locally!

#### With npx (Quick Start)

You can run the server directly using npx:

```bash
npx -y @prandogabriel/ieee2030.5-mcp
```

#### Claude Desktop Configuration (Published Package)

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ieee2030-5-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@prandogabriel/ieee2030.5-mcp@0.1.0"
      ],
      "env": {
        "IEEE2030_BASE_URL": "https://your-ieee2030-server:port",
        "IEEE2030_CERT_PATH": "/path/to/your/cert.pem",
        "IEEE2030_INSECURE": "true"
      }
    }
  }
}
```

**Benefits of using the published package:**
- ✅ **No local setup required** - just install and run
- ✅ **Always up-to-date** - specify version or use latest
- ✅ **Automatic dependency management** - npx handles everything
- ✅ **Cross-platform compatibility** - works on any system with Node.js

**Configuration Steps:**

1. **Ensure Node.js 20+ is installed** (see [Prerequisites](#prerequisites))
2. **Add configuration to Claude Desktop** using the JSON above
3. **Update environment variables** with your IEEE 2030.5 server details:
   - Replace `https://your-ieee2030-server:port` with your server URL
   - Replace `/path/to/your/cert.pem` with your certificate path
   - Set `IEEE2030_INSECURE` to `"false"` for production
4. **Restart Claude Desktop**
5. **Test the connection:**
   - Ask Claude: "Check the IEEE 2030.5 server status"
   - Ask Claude: "Show me the navigation guide for IEEE 2030.5 resources"

### Using with Claude Desktop (Local Development)

To use this MCP server with Claude Desktop, add the following configuration to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ieee2030-5-mcp": {
      "command": "node",
      "args": [
        "/path/to/your/ieee2030.5-mcp/dist/index.js"
      ],
      "env": {
        "IEEE2030_BASE_URL": "https://your-ieee2030-server:port",
        "IEEE2030_CERT_PATH": "/path/to/your/cert.pem",
        "IEEE2030_INSECURE": "true"
      }
    }
  }
}
```

**Configuration Steps:**

1. **Build your server first:**
   ```bash
   cd /path/to/your/ieee2030.5-mcp
   pnpm build
   ```

2. **Update the config with your actual paths:**
   - Replace `/path/to/your/ieee2030.5-mcp/dist/index.js` with the full path to your built server
   - Replace `https://your-ieee2030-server:port` with your actual IEEE 2030.5 server URL
   - Replace `/path/to/your/cert.pem` with the path to your client certificate

3. **Restart Claude Desktop** for the changes to take effect

4. **Test the connection:**
   - Ask Claude: "Check the IEEE 2030.5 server status"
   - Ask Claude: "Get device capabilities from the IEEE 2030.5 server"
   - Ask Claude: "Show me the navigation guide for IEEE 2030.5 resources"

### Using MCP Inspector

1. **Start the inspector:**
   ```bash
   pnpm debug
   ```

2. **Test ieee2030_get_device_capabilities:**
   - Open the inspector at `http://localhost:5173`
   - Click on "Tools" tab
   - Find `ieee2030_get_device_capabilities` in the list
   - Click "Execute" to test the tool
   - View the IEEE 2030.5 XML response in JSON format

3. **Test custom endpoints:**
   - Select `ieee2030_get_custom_endpoint`
   - Enter endpoint path like `/dcap`, `/tm`, `/drp`
   - Execute and see results

4. **Access navigation guide:**
   - Click on "Prompts" tab
   - Find `ieee2030_navigation_guide` 
   - Click to view the comprehensive guide for navigating IEEE 2030.5 resources

### Programmatic Usage

You can also connect to your MCP server programmatically using the MCP SDK:

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'node:child_process';

// Start your server process
const serverProcess = spawn('node', ['dist/index.js']);
const transport = new StdioClientTransport({
  reader: serverProcess.stdout,
  writer: serverProcess.stdin,
});

// Connect and use tools
const client = new Client({ name: 'my-client', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);

// Call IEEE 2030.5 tools
const response = await client.request({
  method: 'tools/call',
  params: { name: 'ieee2030_get_device_capabilities' }
}, { method: 'tools/call' });
```

## Contributing

We welcome contributions to the IEEE 2030.5 MCP Server! Whether you're fixing bugs, adding features, improving documentation, or enhancing the navigation guide, your help is appreciated.

### 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/ieee2030.5-mcp.git
   cd ieee2030.5-mcp
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### 🛠️ Development Guidelines

#### Code Style
- Follow existing TypeScript conventions
- Use **Biome** for linting and formatting: `pnpm check:fix`
- Write descriptive commit messages following conventional commits
- Add JSDoc comments for public APIs

#### Testing Your Changes
1. **Build the project**: `pnpm build`
2. **Test with MCP Inspector**: `pnpm debug`
3. **Test with Claude Desktop** using your local build
4. **Verify all tools work** with a real IEEE 2030.5 server (if available)

#### Code Quality Checklist
- [ ] Code builds without errors: `pnpm build`
- [ ] Linting passes: `pnpm lint`
- [ ] Formatting is correct: `pnpm format`
- [ ] All tools can be loaded in MCP Inspector
- [ ] Navigation guide reflects any new endpoints

### 🎯 Areas for Contribution

#### 🐛 Bug Fixes
- Fix SSL/TLS connection issues
- Improve error handling and messages
- Resolve XML parsing edge cases

#### ✨ Features
- **New IEEE 2030.5 endpoints** (e.g., pricing, messaging, historical data)
- **Enhanced XML/JSON conversion** with schema validation

#### 📚 Documentation
- **Expand navigation guide** with more examples
- **Add more IEEE 2030.5 resource patterns**
- **Create video tutorials** or walkthroughs
- **Improve error documentation**

#### 🧪 Testing
- **Unit tests** for client functions
- **Integration tests** with mock IEEE 2030.5 servers
- **End-to-end tests** with MCP protocol

### 📝 Contribution Workflow

1. **Create an issue** first (for larger changes)
2. **Implement your changes**:
   ```bash
   # Make your changes
   pnpm check:fix    # Format and lint
   pnpm build        # Test build
   pnpm debug        # Test functionality
   ```
3. **Commit with conventional format**:
   ```bash
   git add .
   git commit -m "feat: add support for new IEEE 2030.5 endpoint"
   # or
   git commit -m "fix: resolve SSL certificate validation issue"
   # or  
   git commit -m "docs: expand navigation guide with pricing examples"
   ```
4. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** with:
   - Clear description of changes
   - Screenshots/examples if applicable
   - Reference to related issues

### 🏗️ Architecture Overview

Understanding the codebase structure:

```
src/
├── handlers/           # MCP request handlers
│   ├── tools-handler.ts    # Tool execution logic
│   └── prompts-handler.ts  # Prompt serving logic
├── prompts/           # MCP prompts
│   └── ieee2030-navigation-guide.ts
├── services/          # Core business logic
│   ├── config.ts          # Environment configuration
│   ├── ieee2030-5-client.ts  # IEEE 2030.5 HTTP client
│   └── ieee2030-5-types.ts   # TypeScript definitions
├── tools/             # MCP tools implementation
│   ├── ieee2030-connection-tools.ts
│   ├── ieee2030-data-tools.ts
│   └── tool-registry.ts
├── server.ts          # MCP server setup
└── index.ts           # Entry point
```

### 🤝 Community Guidelines

- **Be respectful** and inclusive in all interactions
- **Ask questions** if you're unsure about anything
- **Help others** by reviewing PRs and answering issues
- **Follow the code of conduct** (be kind and professional)

### 📧 Getting Help

- **Open an issue** for bugs or feature requests
- **Start a discussion** for questions or ideas
- **Check existing issues** before creating new ones

Thank you for contributing to the IEEE 2030.5 MCP Server! 🎉

## Security Notes

- Always use HTTPS in production
- Store certificates securely
- Set `IEEE2030_INSECURE=false` in production
- Validate all server certificates in production environments
- **Never commit `.env` files** or certificates to version control

## Troubleshooting

### Common Issues

1. **"IEEE2030_BASE_URL environment variable is required"**
   - Set the `IEEE2030_BASE_URL` environment variable

2. **"Certificate path or value is required"**
   - Set either `IEEE2030_CERT_PATH` or `IEEE2030_CERT_VALUE`

3. **SSL Certificate errors**
   - For development: Set `IEEE2030_INSECURE=true`
   - For production: Ensure proper certificate chain

4. **Connection timeouts**
   - Increase `IEEE2030_TIMEOUT` value
   - Check network connectivity
   - Verify server URL and port
