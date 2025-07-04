import type { Prompt } from '@modelcontextprotocol/sdk/types.js';

export const ieee2030NavigationPrompt: Prompt = {
  name: 'ieee2030_navigation_guide',
  description: 'Comprehensive guide for navigating IEEE 2030.5 resources using HATEOAS principles',
  arguments: [],
};

export const ieee2030NavigationGuideContent = `
# IEEE 2030.5 Resource Navigation Guide

## Overview
IEEE 2030.5 uses HATEOAS (Hypermedia as the Engine of Application State) principles. This means each resource response contains links to related resources, allowing you to discover and navigate the entire API dynamically.

## Starting Point: Device Capabilities (/dcap)
Always start by fetching the Device Capabilities to discover available resources:

\`\`\`
GET /dcap
\`\`\`

Response example:
\`\`\`xml
<DeviceCapability xmlns="urn:ieee:std:2030.5:ns" href="/dcap" pollRate="900">
  <DemandResponseProgramListLink href="/drp" all="1"/>
  <DERProgramListLink href="/derp" all="1"/>
  <ResponseSetListLink href="/rsps" all="1"/>
  <TimeLink href="/tm"/>
  <UsagePointListLink href="/upt" all="1"/>
  <EndDeviceListLink href="/edev" all="1"/>
  <MirrorUsagePointListLink href="/mup" all="1"/>
  <SelfDeviceLink href="/sdev"/>
</DeviceCapability>
\`\`\`

## Navigation Patterns

### 1. List Resources
Links ending with "ListLink" point to collections. The "all" attribute indicates the total count.

Example - Getting End Devices:
\`\`\`
GET /edev
\`\`\`

Response:
\`\`\`xml
<EndDeviceList xmlns="urn:ieee:std:2030.5:ns" href="/edev" all="2" results="2">
  <EndDevice href="/edev/1" subscribable="1">
    <sFDI>123456789</sFDI>
    <changedTime>1609459200</changedTime>
    <enabled>true</enabled>
    <DERListLink href="/edev/1/der" all="1"/>
    <DeviceInformationLink href="/edev/1/di"/>
    <DeviceStatusLink href="/edev/1/dstat"/>
    <PowerStatusLink href="/edev/1/ps"/>
  </EndDevice>
  <EndDevice href="/edev/2" subscribable="1">
    <sFDI>987654321</sFDI>
    <changedTime>1609459200</changedTime>
    <enabled>true</enabled>
    <DERListLink href="/edev/2/der" all="0"/>
    <DeviceInformationLink href="/edev/2/di"/>
    <DeviceStatusLink href="/edev/2/dstat"/>
    <PowerStatusLink href="/edev/2/ps"/>
  </EndDevice>
</EndDeviceList>
\`\`\`

### 2. Following Nested Links
Each resource contains links to related sub-resources. Follow these to get detailed information:

\`\`\`
GET /edev/1/der
\`\`\`

Response:
\`\`\`xml
<DERList xmlns="urn:ieee:std:2030.5:ns" href="/edev/1/der" all="1" results="1">
  <DER href="/edev/1/der/1" subscribable="1">
    <mRID>DER-001</mRID>
    <DERCapabilityLink href="/edev/1/der/1/dercap"/>
    <DERSettingsLink href="/edev/1/der/1/derg"/>
    <DERStatusLink href="/edev/1/der/1/ders"/>
    <DERAvailabilityLink href="/edev/1/der/1/dera"/>
  </DER>
</DERList>
\`\`\`

### 3. DER Program Navigation
For DER programs, start with the program list:

\`\`\`
GET /derp
\`\`\`

Then navigate to specific programs and their controls:
\`\`\`
GET /derp/1
GET /derp/1/derc  # DER Controls
GET /derp/1/dc    # DER Curves
\`\`\`

### 4. Usage Point Navigation
Usage points contain metering data:

\`\`\`
GET /upt
GET /upt/1
GET /upt/1/mr    # Meter Readings
GET /upt/1/mr/1/rs  # Reading Sets
\`\`\`

## Common Link Patterns

| Link Type | Description | Example |
|-----------|-------------|---------|
| ListLink | Points to a collection | /edev (EndDeviceListLink) |
| Single Resource Link | Points to a specific resource | /sdev (SelfDeviceLink) |
| Nested Resource | Sub-resource of a parent | /edev/1/der |
| Action Link | Endpoint for posting actions | /rsps (ResponseSetListLink) |

## Navigation Best Practices

1. **Always Start with /dcap**: This gives you the complete map of available resources
2. **Check the "all" attribute**: Tells you how many items are in a collection
3. **Follow Links Dynamically**: Don't hardcode paths, use the links provided in responses
4. **Handle Pagination**: Large collections may require pagination parameters
5. **Respect pollRate**: The pollRate in /dcap indicates how often to poll for updates (in seconds)

## Example Navigation Flow

To get all DER information for all devices:

1. GET /dcap - Discover available resources
2. GET /edev - List all end devices
3. For each end device:
   - GET /edev/{id}/der - List DERs for this device
   - For each DER:
     - GET /edev/{id}/der/{derId}/dercap - Get DER capabilities
     - GET /edev/{id}/der/{derId}/ders - Get DER status
     - GET /edev/{id}/der/{derId}/derg - Get DER settings

## Resource Types Reference

- **dcap**: Device Capabilities - Starting point
- **edev**: End Devices - Physical devices
- **der**: Distributed Energy Resources
- **derp**: DER Programs - Control programs for DERs
- **drp**: Demand Response Programs
- **upt**: Usage Points - Metering locations
- **mup**: Mirror Usage Points - Mirrored meter data
- **sdev**: Self Device - Information about this specific device
- **tm**: Time - Server time synchronization
- **rsps**: Response Sets - For posting responses to controls

## Tips for Exploration

1. Use the custom endpoint tool to explore any href you find
2. Look for "subscribable" attributes - these resources support subscriptions
3. Check "changedTime" to see when resources were last updated
4. The "mRID" (meter/resource ID) is often used as a unique identifier
`;

export function getNavigationGuideHandler() {
  return async () => {
    return {
      messages: [
        {
          role: 'assistant' as const,
          content: {
            type: 'text' as const,
            text: ieee2030NavigationGuideContent,
          },
        },
      ],
    };
  };
}
