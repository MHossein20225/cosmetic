import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const runnerPath = fileURLToPath(new URL("../scripts/audit-test.mjs", import.meta.url));
const developmentUrl = "postgresql://dev-user:dev-secret@localhost:5432/cosmetic_db?schema=public";

function runMutatingAction(testDatabaseUrl: string) {
  return spawnSync(process.execPath, [runnerPath, "migrate"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      DATABASE_URL: developmentUrl,
      TEST_DATABASE_URL: testDatabaseUrl,
    },
  });
}

test("integration runner stops before migrations when TEST_DATABASE_URL is missing", () => {
  const result = runMutatingAction("");
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

  assert.equal(result.status, 1);
  assert.match(output, /TEST_DATABASE_URL is required/);
  assert.doesNotMatch(output, /Loaded Prisma config|Datasource|dev-secret|postgresql:\/\//);
});

test("integration runner rejects a test URL that names the live database", () => {
  const liveUrlWithAuditName = "postgresql://dev-user:dev-secret@localhost:5432/cosmetic_audit_ci?schema=public";
  const result = spawnSync(process.execPath, [runnerPath, "migrate"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      DATABASE_URL: liveUrlWithAuditName,
      TEST_DATABASE_URL: "postgresql://test-user:test-secret@127.0.0.1:5432/cosmetic_audit_ci?schema=public",
    },
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

  assert.equal(result.status, 1);
  assert.match(output, /distinct from DATABASE_URL/);
  assert.doesNotMatch(output, /dev-secret|test-secret|postgresql:\/\//);
});

test("integration runner rejects non-loopback test database hosts", () => {
  const result = runMutatingAction("postgresql://test-user:test-secret@example.invalid:5432/cosmetic_audit_ci?schema=public");
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

  assert.equal(result.status, 1);
  assert.match(output, /loopback PostgreSQL host/);
  assert.doesNotMatch(output, /dev-secret|test-secret|postgresql:\/\//);
});

test("integration runner rejects malformed test database URLs before migrations", () => {
  const result = runMutatingAction("not-a-postgresql-url");
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;

  assert.equal(result.status, 1);
  assert.match(output, /must be a valid PostgreSQL connection URL/);
  assert.doesNotMatch(output, /Loaded Prisma config|Datasource|dev-secret|postgresql:\/\//);
});
