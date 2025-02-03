import jwt from "jsonwebtoken";

import authService from "../../src/services/authService.js";
import { AuthenticationError } from "../../src/utils/appError.js";

jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  it("should return a token for a valid user", async () => {
    const user = { id: 1, email: "test@example.com" };
    const token = "mockToken";
    jwt.sign.mockReturnValue(token);

    const result = await authService.login(user);
    expect(result).toEqual(token);
    expect(jwt.sign).toHaveBeenCalledWith(user, expect.any(String), {
      expiresIn: expect.any(String),
    });
  });
  it("should should throw an AuthenticationError if token generation fails", async () => {
    const user = { id: 1, email: "test@example.com" };
    jwt.sign.mockImplementation(() => {
      throw new AuthenticationError("Token generation failed");
    });

    await expect(authService.login(user)).rejects.toThrow(AuthenticationError);
  });
});
