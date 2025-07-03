// Central tool registry for IEEE 2030.5 MCP server

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { IEEE2030Client } from '../services/ieee2030-5-client.js';
import {
  connectionToolDefinitions,
  createStatusHandler,
  createTestConnectionHandler,
} from './ieee2030-connection-tools.js';
import {
  createCustomEndpointHandler,
  createDERProgramsHandler,
  createDemandResponseProgramsHandler,
  createDeviceCapabilitiesHandler,
  createEndDevicesHandler,
  createTimeHandler,
  createUsagePointsHandler,
  dataToolDefinitions,
} from './ieee2030-data-tools.js';
import type { ToolDefinition, ToolRegistry } from './types.js';

/**
 * Creates the complete tool registry with all IEEE 2030.5 tools
 */
export const createToolRegistry = (client: IEEE2030Client | null): ToolRegistry => {
  const registry: ToolRegistry = {
    // Connection tools (always available)
    ieee2030_status: createStatusHandler(client),

    // Data tools (only available when client is configured)
    ieee2030_test_connection: createTestConnectionHandler(client),
    ieee2030_get_device_capabilities: createDeviceCapabilitiesHandler(client),
    ieee2030_get_demand_response_programs: createDemandResponseProgramsHandler(client),
    ieee2030_get_der_programs: createDERProgramsHandler(client),
    ieee2030_get_time: createTimeHandler(client),
    ieee2030_get_usage_points: createUsagePointsHandler(client),
    ieee2030_get_end_devices: createEndDevicesHandler(client),
    ieee2030_get_custom_endpoint: createCustomEndpointHandler(client),
  };

  return registry;
};

/**
 * Gets the list of available tools based on client availability
 */
export const getAvailableTools = (client: IEEE2030Client | null): Tool[] => {
  // Always include status tool
  const tools: ToolDefinition[] = [
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

  // Only include other tools if client is configured
  if (client) {
    tools.push(...connectionToolDefinitions.filter((tool) => tool.name !== 'ieee2030_status'));
    tools.push(...dataToolDefinitions);
  }

  return tools;
};
