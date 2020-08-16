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
      res
        .status(500)
        .json({ error: { msg: "Server error trying to create event" } });
    }
  }
);

/**
 * Get all events
 * GET/
 */
eventRouter.get("/", auth, async (req: Request, res: Response) => {
  try {
    const events = await Event.find({}).populate("attending", [
      "email",
      "steam64Id",
      "name",
      "discordId",
    ]);

    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: { msg: "Server error trying to get all events" } });
  }
});

/**
 * Get event with id
 * GET/:eventId
 */
eventRouter.get("/:eventId", auth, async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.eventId).populate(
      "attending",
      ["email", "steam64Id", "name", "discordId"]
    );

    if (!event) {
      return res.status(404).json({
        error: {
          msg: `Event with id ${req.params.eventId} could not be found`,
        },
      });
    }

    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: {
        msg: `Server error trying to get event with id ${req.params.eventId}`,
      },
    });
  }
});

export default eventRouter;
