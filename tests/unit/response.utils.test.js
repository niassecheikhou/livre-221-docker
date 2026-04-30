import { ok, created, fail } from "../../src/utils/response.js";

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

describe("response helpers", () => {
  it("ok returns 200 by default with success payload", () => {
    const res = createMockRes();
    const data = { id: 1 };

    const returned = ok(res, data, "OK");

    expect(returned).toBe(res);
    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({
      success: true,
      message: "OK",
      data,
    });
  });

  it("created returns 201 with success payload", () => {
    const res = createMockRes();
    const data = { id: 2 };

    created(res, data, "Created");

    expect(res.statusCode).toBe(201);
    expect(res.payload).toEqual({
      success: true,
      message: "Created",
      data,
    });
  });

  it("fail returns provided status with error payload", () => {
    const res = createMockRes();
    const errors = [{ field: "email", message: "invalid" }];

    fail(res, "Bad request", 400, errors);

    expect(res.statusCode).toBe(400);
    expect(res.payload).toEqual({
      success: false,
      message: "Bad request",
      errors,
    });
  });
});
