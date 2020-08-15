import { NextFunction } from "express";

import { Request, Response } from "express";

export default (
  roles: ("Guest" | "Player" | "Coach" | "Manager" | "Admin")[]
) => (req: Request, res: Response, next: NextFunction) => {
  const role = req.body.role || "";

  if (role && roles.includes(role)) {
    next();
  } else {
    res.status(403).json({
      error: {
        msg: `User with role ${role} is not authorized to access this route`,
      },
    });
  }
};
