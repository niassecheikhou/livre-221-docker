import { createClientSchema } from "../../src/validations/client.schema.js";
import { createEditeurSchema } from "../../src/validations/editeur.schema.js";
import { createLivreSchema } from "../../src/validations/livre.schema.js";
import { idParamSchema } from "../../src/validations/common.schema.js";

describe("validation schemas", () => {
  it("accepts valid @gmai.com email and Senegal phone for client", () => {
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
    expect(parsed.body.email).toBe("jean@gmai.com");
  });

  it("rejects non-@gmai.com email for client", () => {
    const payload = {
      body: {
        prenom: "Jean",
        nom: "Dupont",
        email: "jean@gmail.com",
        adresseLivraison: "Dakar",
      },
    };

    expect(() => createClientSchema.parse(payload)).toThrow();
  });

  it("rejects invalid email domain for editor", () => {
    const payload = {
      body: {
        nom: "Hachette",
        email: "contact@example.com",
      },
    };

    expect(() => createEditeurSchema.parse(payload)).toThrow();
  });

  it("rejects negative book price", () => {
    const payload = {
      body: {
        titre: "Clean Code",
        auteur: "Robert Martin",
        prix: -1,
        qteStock: 5,
        editeurId: 1,
      },
    };

    expect(() => createLivreSchema.parse(payload)).toThrow();
  });

  it("coerces id param to positive integer", () => {
    const payload = {
      params: { id: "42" },
    };

    const parsed = idParamSchema.parse(payload);
    expect(parsed.params.id).toBe(42);
  });
});
