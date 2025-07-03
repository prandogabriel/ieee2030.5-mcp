// IEEE 2030.5 data retrieval tools

import type { IEEE2030Client } from '../services/ieee2030-5-client.js';
import type { ToolDefinition, ToolHandler, ToolResponse } from './types.js';

/**
 * Creates a device capabilities tool handler
 */
export const createDeviceCapabilitiesHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const response = await client.getDeviceCapabilities();
    return {
      content: [
        {
          type: 'text',
          text: `Device Capabilities:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Creates a demand response programs tool handler
 */
export const createDemandResponseProgramsHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const response = await client.getDemandResponsePrograms();
    return {
      content: [
        {
          type: 'text',
          text: `Demand Response Programs:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Creates a DER programs tool handler
 */
export const createDERProgramsHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const response = await client.getDERPrograms();
    return {
      content: [
        {
          type: 'text',
          text: `DER Programs:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Creates a time tool handler
 */
export const createTimeHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const response = await client.getTime();
    return {
      content: [
        {
          type: 'text',
          text: `Server Time:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Creates a usage points tool handler
 */
export const createUsagePointsHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const response = await client.getUsagePoints();
    return {
      content: [
        {
          type: 'text',
          text: `Usage Points:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Creates an end devices tool handler
 */
export const createEndDevicesHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const response = await client.getEndDevices();
    return {
      content: [
        {
          type: 'text',
          text: `End Devices:\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Creates a custom endpoint tool handler
 */
export const createCustomEndpointHandler = (client: IEEE2030Client | null): ToolHandler => {
  return async (args?: Record<string, unknown>): Promise<ToolResponse> => {
    if (!client) {
      throw new Error('should have IEEE 2030.5 client configured');
    }

    const endpoint = args?.endpoint as string;
    if (!endpoint) {
      throw new Error('should provide endpoint parameter');
    }

    const response = await client.getCustomEndpoint(endpoint);
    return {
      content: [
        {
          type: 'text',
          text: `Custom Endpoint (${endpoint}):\n${JSON.stringify(response.data, null, 2)}`,
        },
      ],
    };
  };
};

/**
 * Tool definitions for data retrieval tools
 */
export const dataToolDefinitions: ToolDefinition[] = [
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
