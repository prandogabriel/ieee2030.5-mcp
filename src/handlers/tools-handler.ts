import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import type { IEEE2030Client } from '../services/ieee2030-5-client.js';
import type { ToolRegistry } from '../tools/index.js';
import { getAvailableTools } from '../tools/index.js';

/**
 * Sets up all tool-related request handlers for the MCP server
 */
export function setupToolHandlers(
  server: Server,
  ieee2030Client: IEEE2030Client | null,
  toolRegistry: ToolRegistry
): void {
  // Set up tools list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = getAvailableTools(ieee2030Client);
    return { tools };
  });

  // Set up tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    // Get the tool handler from registry
    const handler = toolRegistry[name as keyof typeof toolRegistry];
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
}
