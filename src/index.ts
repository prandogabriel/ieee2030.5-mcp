import 'dotenv/config';
import { IEEE2030_5_MCPServer } from './server.js';

async function main(): Promise<void> {
  const server = new IEEE2030_5_MCPServer();
  await server.run();
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
