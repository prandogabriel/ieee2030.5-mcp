import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { ConfigError } from './services/config.js';
import { IEEE2030Client } from './services/ieee2030-5-client.js';

class IEEE2030_5_MCPServer {
  private server: Server;
  private ieee2030Client: IEEE2030Client | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'ieee2030.5-mcp',
        version: '0.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.initializeIEEE2030Client();
    this.setupHandlers();
  }

  private initializeIEEE2030Client(): void {
    try {
      this.ieee2030Client = IEEE2030Client.fromEnvironment();
      console.error('IEEE 2030.5 client initialized successfully');
    } catch (error) {
      if (error instanceof ConfigError) {
        console.error(`IEEE 2030.5 configuration error: ${error.message}`);
        console.error(
          'IEEE 2030.5 tools will be disabled. Please check your environment variables.'
        );
      } else {
        console.error(
          `Failed to initialize IEEE 2030.5 client: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        {
          name: 'ieee2030_test_connection',
          description: 'Test connection to IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_device_capabilities',
          description: 'Get device capabilities from IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_demand_response_programs',
          description: 'Get demand response programs from IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_der_programs',
          description: 'Get DER (Distributed Energy Resource) programs from IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_time',
          description: 'Get current time from IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_usage_points',
          description: 'Get usage points from IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_end_devices',
          description: 'Get end devices from IEEE 2030.5 server',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false,
          },
        },
        {
          name: 'ieee2030_get_custom_endpoint',
          description: 'Get data from a custom IEEE 2030.5 endpoint',
          inputSchema: {
            type: 'object',
            properties: {
              endpoint: {
                type: 'string',
                description: 'The endpoint path (e.g., "/dcap", "/tm")',
              },
            },
            required: ['endpoint'],
            additionalProperties: false,
          },
        },
      ];

      // Only return tools if IEEE 2030.5 client is available
      if (!this.ieee2030Client) {
        return {
          tools: [
            {
              name: 'ieee2030_status',
              description: 'Check IEEE 2030.5 client status and configuration',
              inputSchema: {
                type: 'object',
                properties: {},
                additionalProperties: false,
              },
            },
          ],
        };
      }

      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Handle status check when client is not available
      if (name === 'ieee2030_status') {
        return {
          content: [
            {
              type: 'text',
              text: this.ieee2030Client
                ? 'IEEE 2030.5 client is initialized and ready'
                : 'IEEE 2030.5 client is not available. Please check your environment variables:\n- IEEE2030_BASE_URL\n- IEEE2030_CERT_PATH or IEEE2030_CERT_VALUE\n- IEEE2030_KEY_PATH or IEEE2030_KEY_VALUE (if using cert path)',
            },
          ],
        };
      }

      // Check if IEEE 2030.5 client is available
      if (!this.ieee2030Client) {
        throw new McpError(
          ErrorCode.InternalError,
          'IEEE 2030.5 client is not configured. Please check your environment variables.'
        );
      }

      try {
        switch (name) {
          case 'ieee2030_test_connection': {
            const result = await this.ieee2030Client.testConnection();
            return {
              content: [
                {
                  type: 'text',
                  text: `Connection test ${result.success ? 'successful' : 'failed'}: ${result.message}`,
                },
              ],
            };
          }

          case 'ieee2030_get_device_capabilities': {
            const response = await this.ieee2030Client.getDeviceCapabilities();
            return {
              content: [
                {
                  type: 'text',
                  text: `Device Capabilities:\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          case 'ieee2030_get_demand_response_programs': {
            const response = await this.ieee2030Client.getDemandResponsePrograms();
            return {
              content: [
                {
                  type: 'text',
                  text: `Demand Response Programs:\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          case 'ieee2030_get_der_programs': {
            const response = await this.ieee2030Client.getDERPrograms();
            return {
              content: [
                {
                  type: 'text',
                  text: `DER Programs:\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          case 'ieee2030_get_time': {
            const response = await this.ieee2030Client.getTime();
            return {
              content: [
                {
                  type: 'text',
                  text: `Server Time:\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          case 'ieee2030_get_usage_points': {
            const response = await this.ieee2030Client.getUsagePoints();
            return {
              content: [
                {
                  type: 'text',
                  text: `Usage Points:\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          case 'ieee2030_get_end_devices': {
            const response = await this.ieee2030Client.getEndDevices();
            return {
              content: [
                {
                  type: 'text',
                  text: `End Devices:\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          case 'ieee2030_get_custom_endpoint': {
            const endpoint = args?.endpoint as string;
            if (!endpoint) {
              throw new McpError(ErrorCode.InvalidParams, 'endpoint parameter is required');
            }
            const response = await this.ieee2030Client.getCustomEndpoint(endpoint);
            return {
              content: [
                {
                  type: 'text',
                  text: `Custom Endpoint (${endpoint}):\n${JSON.stringify(response.data, null, 2)}`,
                },
              ],
            };
          }

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `IEEE 2030.5 operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('IEEE 2030.5 MCP server running on stdio');
  }
}

async function main(): Promise<void> {
  const server = new IEEE2030_5_MCPServer();
  await server.run();
  console.log('Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
