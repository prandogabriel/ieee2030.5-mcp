#!/usr/bin/env node

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'node:child_process';

class IEEE2030MCPTestClient {
  constructor() {
    this.client = new Client(
      {
        name: 'ieee2030-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );
  }

  async connect() {
    console.log('🚀 Starting IEEE 2030.5 MCP Server...');
    
    // Validate required environment variables
    if (!process.env.IEEE2030_BASE_URL) {
      throw new Error('IEEE2030_BASE_URL environment variable is required');
    }
    
    if (!process.env.IEEE2030_CERT_PATH && !process.env.IEEE2030_CERT_VALUE) {
      throw new Error('Either IEEE2030_CERT_PATH or IEEE2030_CERT_VALUE environment variable is required');
    }
    
    // Start the MCP server process
    const serverProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'inherit'],
      env: process.env
    });

    // Create transport using the server process
    const transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin,
    });

    // Connect to the server
    await this.client.connect(transport);
    console.log('✅ Connected to IEEE 2030.5 MCP Server');

    // Handle server process errors
    serverProcess.on('error', (error) => {
      console.error('❌ Server process error:', error);
    });

    serverProcess.on('exit', (code) => {
      console.log(`🔴 Server process exited with code ${code}`);
    });

    return serverProcess;
  }

  async listTools() {
    console.log('\n📋 Listing available tools...');
    try {
      const response = await this.client.request(
        { method: 'tools/list' },
        { method: 'tools/list' }
      );
      
      console.log('Available tools:');
      response.tools.forEach((tool, index) => {
        console.log(`  ${index + 1}. ${tool.name} - ${tool.description}`);
      });
      
      return response.tools;
    } catch (error) {
      console.error('❌ Error listing tools:', error);
      throw error;
    }
  }

  async callTool(name, args = {}) {
    console.log(`\n🔧 Calling tool: ${name}`);
    try {
      const response = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name,
            arguments: args,
          },
        },
        { method: 'tools/call' }
      );
      
      console.log('Response:');
      response.content.forEach((content) => {
        if (content.type === 'text') {
          console.log(content.text);
        }
      });
      
      return response;
    } catch (error) {
      console.error(`❌ Error calling tool ${name}:`, error);
      throw error;
    }
  }

  async testConnection() {
    console.log('\n🧪 Testing IEEE 2030.5 connection...');
    return this.callTool('ieee2030_test_connection');
  }

  async getDeviceCapabilities() {
    console.log('\n📡 Getting device capabilities...');
    return this.callTool('ieee2030_get_device_capabilities');
  }

  async getTime() {
    console.log('\n⏰ Getting server time...');
    return this.callTool('ieee2030_get_time');
  }

  async testCustomEndpoint(endpoint) {
    console.log(`\n🔍 Testing custom endpoint: ${endpoint}`);
    return this.callTool('ieee2030_get_custom_endpoint', { endpoint });
  }

  async checkStatus() {
    console.log('\n📊 Checking IEEE 2030.5 status...');
    return this.callTool('ieee2030_status');
  }

  async disconnect() {
    console.log('\n👋 Disconnecting...');
    await this.client.close();
  }
}

// Main test function
async function runTests() {
  const testClient = new IEEE2030MCPTestClient();
  let serverProcess;

  try {
    // Connect to server
    serverProcess = await testClient.connect();
    
    // Wait a moment for server to fully start
    await new Promise(resolve => setTimeout(resolve, 1000));

    // List available tools
    const tools = await testClient.listTools();

    // Check status first
    await testClient.checkStatus();

    // If IEEE 2030.5 client is configured, run more tests
    const hasIEEE2030Tools = tools.some(tool => tool.name.startsWith('ieee2030_') && tool.name !== 'ieee2030_status');
    
    if (hasIEEE2030Tools) {
      console.log('\n🎯 IEEE 2030.5 client is configured. Running tests...');
      
      // Test connection
      await testClient.testConnection();
      
      // Get device capabilities
      await testClient.getDeviceCapabilities();
      
      // Get server time
      await testClient.getTime();
      
      // Test custom endpoint
      await testClient.testCustomEndpoint('/dcap');
      
    } else {
      console.log('\n⚠️  IEEE 2030.5 client not configured. Only status tool available.');
      console.log('Please set environment variables:');
      console.log('- IEEE2030_BASE_URL');
      console.log('- IEEE2030_CERT_PATH or IEEE2030_CERT_VALUE');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Cleanup
    await testClient.disconnect();
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export default IEEE2030MCPTestClient;