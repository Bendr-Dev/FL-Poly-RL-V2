import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  dotenv.config();
  const JWTSecret = process.env.JWT_SECRET;

  // Grab token from header
  const token = req.cookies["x-auth-token"];

  // Check token's existence
  if (!token) {
    return res
      .status(401)
      .json({ error: { msg: "No token found, authorization denied" } });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWTSecret as string) as any;

    req.body.user = decoded["id"];
    req.body.currentRole = decoded["role"];
    next();
  } catch {
    res.status(401).json({ error: { msg: "Token is not valid" } });
  }
};
