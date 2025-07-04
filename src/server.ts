import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { ConfigError } from './services/config.js';
import { IEEE2030Client } from './services/ieee2030-5-client.js';
import type { PromptRegistry } from './prompts/index.js';
import { createPromptRegistry, getAvailablePrompts } from './prompts/index.js';
import type { ToolRegistry } from './tools/index.js';
import { createToolRegistry, getAvailableTools } from './tools/index.js';

export class IEEE2030_5_MCPServer {
  private server: Server;
  private ieee2030Client: IEEE2030Client | null = null;
  private toolRegistry: ToolRegistry;
  private promptRegistry: PromptRegistry;

  constructor() {
    this.server = new Server(
      {
        name: 'ieee2030.5-mcp',
        version: '0.0.0',
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
        },
      }
    );

    this.initializeIEEE2030Client();
    this.toolRegistry = createToolRegistry(this.ieee2030Client);
    this.promptRegistry = createPromptRegistry();
    this.setupHandlers();
  }

  private initializeIEEE2030Client(): void {
    try {
      this.ieee2030Client = IEEE2030Client.fromEnvironment();
      console.info('IEEE 2030.5 client initialized successfully');
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
    // Set up tools list handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = getAvailableTools(this.ieee2030Client);
      return { tools };
    });

    // Set up tool call handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Get the tool handler from registry
      const handler = this.toolRegistry[name as keyof typeof this.toolRegistry];
      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `should recognize tool: ${name}`);
      }

      try {
        return await handler(args);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `should complete IEEE 2030.5 operation: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });

    // Set up prompts list handler
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      const prompts = getAvailablePrompts();
      return { prompts };
    });

    // Set up get prompt handler
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name } = request.params;

      const handler = this.promptRegistry[name as keyof typeof this.promptRegistry];
      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Prompt not found: ${name}`);
      }

      try {
        return await handler();
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to get prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.info('IEEE 2030.5 MCP server running on stdio');
  }
}
