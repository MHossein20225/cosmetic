import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { resolveAuditTestBaseUrl, resolveAuditTestDatabaseUrls } from './audit-test-env.mjs';
const require = createRequire(import.meta.url);
dotenv.config();

let databaseUrls;
let testBaseUrl;
try {
  databaseUrls = resolveAuditTestDatabaseUrls(process.env);
  testBaseUrl = resolveAuditTestBaseUrl(process.env.TEST_BASE_URL);
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Invalid integration-test configuration');
  process.exit(1);
}

const env = {
  ...process.env,
  AUDIT_LIVE_DATABASE_URL: databaseUrls.liveValidationUrl,
  DATABASE_URL: databaseUrls.testUrl,
  TEST_DATABASE_URL: databaseUrls.testUrl,
  TEST_BASE_URL: testBaseUrl,
  TRUST_PROXY: 'true',
  RATE_LIMIT_IP_HEADER: 'x-forwarded-for',
  PORT: '3001',
  HOSTNAME: '127.0.0.1',
  RATE_LIMIT_SECRET: 'isolated-audit-test-key',
};
const action = process.argv[2];
const commands = {
  migrate: [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'],
  status: [require.resolve('prisma/build/index.js'), 'migrate', 'status'],
  server: [fileURLToPath(new URL('../.next/standalone/server.js', import.meta.url))],
  test: ['--import', 'tsx', '--test', 'tests/integration.test.ts'],
  seed: [require.resolve('prisma/build/index.js'), 'db', 'seed'],
};
if (!commands[action]) throw new Error('Expected migrate, server, test, or seed');
if (action === 'test') {
  const server = spawn(process.execPath, commands.server, { env, stdio: 'inherit' });
  let testStatus = 1;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      if (server.exitCode !== null) throw new Error(`Audit server exited with code ${server.exitCode}`);
      try {
        const response = await fetch(`${env.TEST_BASE_URL}/api/product`);
        if (response.ok) { ready = true; break; }
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (!ready) throw new Error('Audit server did not become ready within 60 seconds');
    const testResult = spawnSync(process.execPath, commands.test, { env, stdio: 'inherit' });
    if (testResult.error) throw testResult.error;
    testStatus = testResult.status ?? 1;
  } finally {
    server.kill();
  }
  process.exit(testStatus);
}
const result = spawnSync(process.execPath, commands[action], { env, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
