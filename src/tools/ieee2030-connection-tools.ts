// IEEE 2030.5 connection and status tools

import type { IEEE2030Client } from '../services/ieee2030-5-client.js';
import type { ToolDefinition, ToolHandler, ToolResponse } from './types.js';

/**
 * Creates a test connection tool handler
 */
export const createTestConnectionHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const result = await client.testConnection();
    return {
      content: [
        {
          type: 'text',
          text: `Connection test ${result.success ? 'successful' : 'failed'}: ${result.message}`,
        },
      ],
    };
  };
};

/**
 * Creates a status check tool handler
 */
export const createStatusHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    const statusText = client
      ? 'IEEE 2030.5 client is initialized and ready'
      : 'IEEE 2030.5 client is not available. Please check your environment variables:\n- IEEE2030_BASE_URL\n- IEEE2030_CERT_PATH or IEEE2030_CERT_VALUE\n- IEEE2030_KEY_PATH or IEEE2030_KEY_VALUE (if using cert path)';

    return {
      content: [
        {
          type: 'text',
          text: statusText,
        },
      ],
    };
  };
};

/**
 * Tool definitions for connection-related tools
 */
export const connectionToolDefinitions: ToolDefinition[] = [
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
    name: 'ieee2030_status',
    description: 'Check IEEE 2030.5 client status and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
  },
];
