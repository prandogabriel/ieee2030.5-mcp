import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ConfigError } from './services/config.js';
import { IEEE2030Client } from './services/ieee2030-5-client.js';
import type { PromptRegistry } from './prompts/index.js';
import { createPromptRegistry } from './prompts/index.js';
import type { ToolRegistry } from './tools/index.js';
import { createToolRegistry } from './tools/index.js';
import { setupPromptHandlers, setupToolHandlers } from './handlers/index.js';

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
    setupToolHandlers(this.server, this.ieee2030Client, this.toolRegistry);
    setupPromptHandlers(this.server, this.promptRegistry);
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.info('IEEE 2030.5 MCP server running on stdio');
  }
}
