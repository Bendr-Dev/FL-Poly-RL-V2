import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import Event from "../models/Event";
import roles from "../utils/middleware/roles";
import auth from "../utils/middleware/auth";

const eventRouter = express.Router();

/**
 * Creates event
 * POST/create
 */
eventRouter.post(
  "/create",
  [
    auth,
    roles(["Player", "Coach", "Manager", "Admin"]),
    check("type", "Type of event is required").not().isEmpty(),
    check("time", "Time of event is required").not().isEmpty(),
    check("format", "Format of event is required").not().isEmpty(),
    check("link", "Link for event is required").not().isEmpty(),
    check("attending", "Attending for event is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json(errors);
    }

    try {
      // Deconstruct request
      const { type, format, link, attending, time } = req.body;

      // Create event
      const newEvent = new Event({
        type,
        format,
        link,
        attending,
        time,
      });

      // Add to DB
      await newEvent.save();

      res.status(201).json(newEvent);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error while trying to create event");
    }
  }
);

export default eventRouter;
