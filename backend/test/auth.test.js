import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import {
  authenticate,
  createAccessToken,
  requireAdmin,
  validateAuthConfig,
} from "../middleware/auth.js";

const secret = "test-secret-with-at-least-32-bytes";

const withAuthEnvironment = (callback) => {
  const previousSecret = process.env.JWT_SECRET;
  const previousAdminEmails = process.env.ADMIN_EMAILS;
  process.env.JWT_SECRET = secret;
  process.env.ADMIN_EMAILS = "Admin@example.com";
  try {
    callback();
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
    if (previousAdminEmails === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = previousAdminEmails;
  }
};

test("issues short-lived tokens with roles based on the server allowlist", () => {
  withAuthEnvironment(() => {
    const adminToken = createAccessToken({ id: 1, gmail: "admin@example.com" });
    const userToken = createAccessToken({ id: 2, gmail: "user@example.com" });
    const adminPayload = jwt.verify(adminToken, secret);
    const userPayload = jwt.verify(userToken, secret);

    assert.equal(adminPayload.role, "admin");
    assert.equal(adminPayload.sub, "1");
    assert.equal(adminPayload.exp - adminPayload.iat, 900);
    assert.equal(userPayload.role, "user");
  });
});

test("rejects requests without a bearer token", () => {
  const response = {
    statusCode: null,
    body: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let continued = false;

  authenticate({ get: () => undefined }, response, () => { continued = true; });

  assert.equal(response.statusCode, 401);
  assert.equal(continued, false);
});

test("allows a valid token and blocks non-admin access to admin operations", () => {
  withAuthEnvironment(() => {
    const token = createAccessToken({ id: 2, gmail: "user@example.com" });
    const request = { get: () => `Bearer ${token}` };
    const response = {
      statusCode: null,
      status(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json() {
        return this;
      },
    };
    let continued = false;

    authenticate(request, response, () => { continued = true; });
    assert.equal(continued, true);
    assert.deepEqual(request.auth, { userId: "2", role: "user" });

    continued = false;
    requireAdmin(request, response, () => { continued = true; });
    assert.equal(response.statusCode, 403);
    assert.equal(continued, false);
  });
});

test("requires a signing secret and administrator allowlist in production", () => {
  const previousEnvironment = {
    nodeEnv: process.env.NODE_ENV,
    secret: process.env.JWT_SECRET,
    adminEmails: process.env.ADMIN_EMAILS,
  };
  process.env.NODE_ENV = "production";
  delete process.env.JWT_SECRET;
  delete process.env.ADMIN_EMAILS;

  try {
    assert.throws(validateAuthConfig, /JWT_SECRET is required in production/);
    process.env.JWT_SECRET = secret;
    assert.throws(validateAuthConfig, /ADMIN_EMAILS must include at least one administrator/);
    process.env.ADMIN_EMAILS = "admin@example.com";
    assert.doesNotThrow(validateAuthConfig);
  } finally {
    if (previousEnvironment.nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment.nodeEnv;
    if (previousEnvironment.secret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousEnvironment.secret;
    if (previousEnvironment.adminEmails === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = previousEnvironment.adminEmails;
  }
});
