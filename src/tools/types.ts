// Tool types and interfaces for MCP IEEE 2030.5 server

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export type ToolName =
  | 'ieee2030_test_connection'
  | 'ieee2030_get_device_capabilities'
  | 'ieee2030_get_demand_response_programs'
  | 'ieee2030_get_der_programs'
  | 'ieee2030_get_time'
  | 'ieee2030_get_usage_points'
  | 'ieee2030_get_end_devices'
  | 'ieee2030_get_custom_endpoint'
  | 'ieee2030_status';

export type ToolContent = {
  type: 'text';
  text: string;
};

export type ToolResponse = {
  content: ToolContent[];
};

export type ToolHandler = (args?: Record<string, unknown>) => Promise<ToolResponse>;

export type ToolRegistry = Record<ToolName, ToolHandler>;

export type ToolDefinition = Tool & {
  name: ToolName;
};
