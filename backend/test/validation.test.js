import test from "node:test";
import assert from "node:assert/strict";
import {
  isObject,
  isValidGmail,
  isValidName,
  isValidPassword,
  normalizeGmail,
} from "../utils/validation.js";

test("validates and normalizes email addresses", () => {
  assert.equal(isValidGmail(" TESTING@GMAIL.COM "), true);
  assert.equal(normalizeGmail(" TESTING@GMAIL.COM "), "testing@gmail.com");
  assert.equal(isValidGmail("not-an-email"), false);
  assert.equal(isValidGmail("x".repeat(250) + "@example.com"), false);
  assert.equal(isValidGmail(null), false);
});

test("rejects empty names and malformed request objects", () => {
  assert.equal(isValidName("  "), false);
  assert.equal(isValidName("Ana"), true);
  assert.equal(isObject({}), true);
  assert.equal(isObject([]), false);
  assert.equal(isObject(null), false);
});

test("accepts non-empty bcrypt-compatible passwords up to 72 UTF-8 bytes", () => {
  assert.equal(isValidPassword("testing123"), true);
  assert.equal(isValidPassword("   "), false);
  assert.equal(isValidPassword("a".repeat(73)), false);
  assert.equal(isValidPassword("é".repeat(36)), true);
  assert.equal(isValidPassword("é".repeat(37)), false);
});
