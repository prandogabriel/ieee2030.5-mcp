import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ErrorCode,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import type { PromptRegistry } from '../prompts/index.js';
import { getAvailablePrompts } from '../prompts/index.js';

/**
 * Sets up all prompt-related request handlers for the MCP server
 */
export function setupPromptHandlers(server: Server, promptRegistry: PromptRegistry): void {
  // Set up prompts list handler
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    const prompts = getAvailablePrompts();
    return { prompts };
  });

  // Set up get prompt handler
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name } = request.params;

    const handler = promptRegistry[name as keyof typeof promptRegistry];
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
