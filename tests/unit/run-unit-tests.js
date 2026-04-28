import assert from "node:assert/strict";
import { z } from "zod";
import validate from "../../src/middlewares/validate.js";
import { ok, created, fail } from "../../src/utils/response.js";
import { createClientSchema } from "../../src/validations/client.schema.js";
import { createEditeurSchema } from "../../src/validations/editeur.schema.js";
import { createLivreSchema } from "../../src/validations/livre.schema.js";
import { idParamSchema } from "../../src/validations/common.schema.js";

let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL - ${name}`);
    console.error(error);
  }
}

function createMockRes() {
  return {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };
}

runTest("validate middleware attaches validatedData and calls next without error", () => {
  const schema = z.object({
    body: z.object({
      name: z.string().min(1),
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
  });

  const req = {
    body: { name: "Awa" },
    params: {},
    query: {},
  };

  const res = {};
  let nextArg;
  const next = (arg) => {
    nextArg = arg;
  };

  validate(schema)(req, res, next);

  assert.equal(nextArg, undefined);
  assert.deepEqual(req.validatedData.body, { name: "Awa" });
});

runTest("validate middleware forwards validation error to next", () => {
  const schema = z.object({
    body: z.object({
      age: z.number().int().positive(),
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional(),
  });

  const req = {
    body: { age: -1 },
    params: {},
    query: {},
  };

  const res = {};
  let nextArg;
  const next = (arg) => {
    nextArg = arg;
  };

  validate(schema)(req, res, next);

  assert.ok(nextArg instanceof Error);
  assert.equal(req.validatedData, undefined);
});

runTest("ok should return 200 by default with success payload", () => {
  const res = createMockRes();
  const data = { id: 1 };

  const returned = ok(res, data, "OK");

  assert.equal(returned, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, {
    success: true,
    message: "OK",
    data,
  });
});

runTest("created should return 201 with success payload", () => {
  const res = createMockRes();
  const data = { id: 2 };

  created(res, data, "Created");

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.payload, {
    success: true,
    message: "Created",
    data,
  });
});

runTest("fail should return provided status with error payload", () => {
  const res = createMockRes();
  const errors = [{ field: "email", message: "invalid" }];

  fail(res, "Bad request", 400, errors);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, {
    success: false,
    message: "Bad request",
    errors,
  });
});

runTest("createClientSchema accepts valid @gmai.com email and Senegal phone", () => {
  const payload = {
    body: {
      prenom: "Jean",
      nom: "Dupont",
      email: "jean@gmai.com",
      telephone: "+221771234567",
      adresseLivraison: "Dakar",
    },
  };

  const parsed = createClientSchema.parse(payload);
  assert.equal(parsed.body.email, "jean@gmai.com");
});

runTest("createClientSchema rejects non-@gmai.com email", () => {
  const payload = {
    body: {
      prenom: "Jean",
      nom: "Dupont",
      email: "jean@gmail.com",
      adresseLivraison: "Dakar",
    },
  };

  assert.throws(() => createClientSchema.parse(payload));
});

runTest("createEditeurSchema rejects invalid email domain", () => {
  const payload = {
    body: {
      nom: "Hachette",
      email: "contact@example.com",
    },
  };

  assert.throws(() => createEditeurSchema.parse(payload));
});

runTest("createLivreSchema rejects negative price", () => {
  const payload = {
    body: {
      titre: "Clean Code",
      auteur: "Robert Martin",
      prix: -1,
      qteStock: 5,
      editeurId: 1,
    },
  };

  assert.throws(() => createLivreSchema.parse(payload));
});

runTest("idParamSchema coerces id to positive integer", () => {
  const payload = {
    params: { id: "42" },
  };

  const parsed = idParamSchema.parse(payload);
  assert.equal(parsed.params.id, 42);
});

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}

console.log("\nAll unit tests passed.");
