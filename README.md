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

Edit `.env` with your configuration:

```bash
# REQUIRED: Your IEEE 2030.5 server URL
IEEE2030_BASE_URL=https://your-ieee2030-server:port

# REQUIRED: Certificate for authentication
IEEE2030_CERT_PATH=/path/to/your/client.pem

# Optional: Security settings
IEEE2030_INSECURE=true  # for development with self-signed certs
```

### 3. Build the Project

```bash
pnpm build
```

### 4. Test the Server

```bash
# Set your environment variables
export IEEE2030_BASE_URL="https://your-server:port"
export IEEE2030_CERT_PATH="/path/to/your/cert.pem"
export IEEE2030_INSECURE="true"

# Run the test client
node test-client.js
```

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

### Basic Connection Test

```javascript
// Using the test client
const client = new IEEE2030MCPTestClient();
await client.connect();
await client.testConnection();
```

### Get Device Capabilities

```javascript
await client.getDeviceCapabilities();
```

### Custom Endpoint Access

```javascript
await client.testCustomEndpoint('/dcap');
await client.testCustomEndpoint('/tm');
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