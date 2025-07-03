# IEEE 2030.5 MCP Server

A Model Context Protocol (MCP) server for interacting with IEEE 2030.5 (SEP 2.0) Smart Energy Profile servers.

## Features

- 🔐 Certificate-based authentication (single .pem or separate cert/key files)
- 📡 Full IEEE 2030.5 endpoint support
- 🛠️ MCP tools for all major IEEE 2030.5 resources
- ⚙️ Environment-based configuration
- 🧪 Built-in test client

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

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

### 3. Build the Project

```bash
pnpm build
```

### 4. Test the Server

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

- `ieee2030_test_connection` - Test connectivity to IEEE 2030.5 server
- `ieee2030_get_device_capabilities` - Get device capabilities (/dcap)
- `ieee2030_get_demand_response_programs` - Get demand response programs (/drp)
- `ieee2030_get_der_programs` - Get DER programs (/derp)
- `ieee2030_get_time` - Get server time (/tm)
- `ieee2030_get_usage_points` - Get usage points (/upt)
- `ieee2030_get_end_devices` - Get end devices (/edev)
- `ieee2030_get_custom_endpoint` - Access any custom endpoint
- `ieee2030_status` - Check client configuration status

## Development

### Start Development Server

```bash
pnpm dev
```

### Lint and Format

```bash
pnpm lint
pnpm format
pnpm check     # Run both lint and format
```

### Build for Production

```bash
pnpm build
```

## Usage Examples

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

## Security Notes

- Always use HTTPS in production
- Store certificates securely
- Set `IEEE2030_INSECURE=false` in production
- Validate all server certificates in production environments

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

### Debug Mode

Enable verbose logging:

```bash
export DEBUG=ieee2030:*
node test-client.js
```