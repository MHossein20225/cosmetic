const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function parseDatabaseUrl(value, variableName) {
  if (!value) throw new Error(`${variableName} is required`);

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid PostgreSQL connection URL`);
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(`${variableName} must use PostgreSQL`);
  }

  const databaseName = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  if (!databaseName || databaseName.includes("/")) {
    throw new Error(`${variableName} must name exactly one database`);
  }

  return { url, databaseName };
}

export function resolveAuditTestDatabaseUrls(environment = process.env) {
  const { url: liveUrl, databaseName: liveDatabaseName } = parseDatabaseUrl(
    environment.DATABASE_URL,
    "DATABASE_URL",
  );
  const { url: testUrl, databaseName: testDatabaseName } = parseDatabaseUrl(
    environment.TEST_DATABASE_URL,
    "TEST_DATABASE_URL",
  );

  if (!LOCAL_DATABASE_HOSTS.has(testUrl.hostname.toLowerCase().replace(/^\[|\]$/g, ""))) {
    throw new Error("TEST_DATABASE_URL must target a loopback PostgreSQL host");
  }

  if (!/(?:^|[_-])(?:test|audit)(?:[_-]|$)/i.test(testDatabaseName)) {
    throw new Error("TEST_DATABASE_URL must use a database name containing test or audit");
  }

  if (testDatabaseName.toLowerCase() === liveDatabaseName.toLowerCase()) {
    throw new Error("TEST_DATABASE_URL must name a database distinct from DATABASE_URL");
  }

  return {
    liveValidationUrl: `${liveUrl.protocol}//${liveUrl.host}/${encodeURIComponent(liveDatabaseName)}`,
    testUrl: testUrl.href,
  };
}

export function resolveAuditTestBaseUrl(value = "http://127.0.0.1:3001") {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("TEST_BASE_URL must be a valid local HTTP URL");
  }

  if (
    url.protocol !== "http:" ||
    !LOCAL_DATABASE_HOSTS.has(url.hostname.toLowerCase().replace(/^\[|\]$/g, ""))
  ) {
    throw new Error("TEST_BASE_URL must use local HTTP");
  }

  return url.href.replace(/\/$/, "");
}
