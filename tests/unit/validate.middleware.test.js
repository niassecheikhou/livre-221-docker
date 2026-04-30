import { z } from "zod";
import { jest } from "@jest/globals";
import validate from "../../src/middlewares/validate.js";

describe("validate middleware", () => {
  it("attaches validatedData and calls next without error", () => {
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
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.validatedData.body).toEqual({ name: "Awa" });
  });

  it("forwards validation error to next", () => {
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
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(req.validatedData).toBeUndefined();
  });
});
