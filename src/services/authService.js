import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { AuthenticationError } from '../utils/appError.js';

export class AuthService {
  async login(user) {
    try {
      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpires,
      });
      return token;
    } catch (e) {
      throw new AuthenticationError("Failed to generate token");
    }
  }
}

export default new AuthService();
