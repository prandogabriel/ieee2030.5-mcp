# Testing IEEE 2030.5 MCP Server

## Quick Start with MCP Inspector

### 1. Configure Environment

```bash
# Copy and edit configuration
cp .env.example .env

# Edit .env with your IEEE 2030.5 server details:
# IEEE2030_BASE_URL=https://your-server:port
# IEEE2030_CERT_PATH=/path/to/your/cert.pem
# IEEE2030_INSECURE=true
```

### 2. Start Inspector

```bash
# Build and start the MCP Inspector
pnpm debug
```

The inspector will:
- Build your MCP server
- Start the inspector web interface at `http://localhost:5173`
- Automatically connect to your IEEE 2030.5 server

### 3. Test Your Tools

#### Available Tools:

1. **ieee2030_status** - Check client configuration
2. **ieee2030_test_connection** - Test server connectivity  
3. **ieee2030_get_device_capabilities** - Get device capabilities (/dcap)
4. **ieee2030_get_demand_response_programs** - Get DR programs (/drp)
5. **ieee2030_get_der_programs** - Get DER programs (/derp)
6. **ieee2030_get_time** - Get server time (/tm)
7. **ieee2030_get_usage_points** - Get usage points (/upt)
8. **ieee2030_get_end_devices** - Get end devices (/edev)
9. **ieee2030_get_custom_endpoint** - Access any endpoint

#### Testing Steps:

1. **Check Status First:**
   - Click on `ieee2030_status` 
   - Execute to verify configuration

2. **Test Connection:**
   - Click on `ieee2030_test_connection`
   - Execute to test IEEE 2030.5 server connectivity

3. **Get Device Capabilities:**
   - Click on `ieee2030_get_device_capabilities`
   - Execute to retrieve /dcap endpoint
   - View parsed XML response in JSON format

4. **Test Custom Endpoints:**
   - Click on `ieee2030_get_custom_endpoint`
   - Enter endpoint like `/dcap`, `/tm`, `/drp`
   - Execute to see raw server response

### 4. Debugging

The inspector shows:
- **Request/Response logs** - See all MCP communication
- **Error details** - Debug connection or parsing issues
- **Tool schemas** - Understand required parameters
- **Live updates** - Real-time server interaction

### 5. Common Issues

- **"Client not configured"** - Check your .env file
- **Connection timeout** - Verify IEEE2030_BASE_URL and network
- **Certificate errors** - Check cert path or set IEEE2030_INSECURE=true
- **XML parsing errors** - Server may not be IEEE 2030.5 compliant

### 6. Example IEEE 2030.5 Response

When testing `ieee2030_get_device_capabilities`, you should see JSON like:

```json
{
  "DeviceCapability": {
    "@": {
      "xmlns": "urn:ieee:std:2030.5:ns",
      "href": "/dcap",
      "pollRate": "900"
    },
    "DemandResponseProgramListLink": {
      "@": { "href": "/drp", "all": "1" }
    },
    "DERProgramListLink": {
      "@": { "href": "/derp", "all": "1" }
    },
    "TimeLink": {
      "@": { "href": "/tm" }
    }
    // ... more links
  }
}
```