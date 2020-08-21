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
    check("name", "Name of event is required").not().isEmpty(),
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
      const { name, type, format, link, attending, time, uploader } = req.body;

      // Create event
      const newEvent = new Event({
        name,
        type,
        format,
        link,
        attending,
        time,
        uploader,
        isCompleted: false,
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
    const events = await Event.find({})
      .populate("attending", [
        "email",
        "steam64Id",
        "name",
        "discordId",
        "username",
      ])
      .populate("uploader", [
        "email",
        "steam64Id",
        "name",
        "discordId",
        "username",
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
    const event = await Event.findById(req.params.eventId)
      .populate("attending", [
        "email",
        "steam64Id",
        "username",
        "discordId",
        "name",
      ])
      .populate("uploader", [
        "email",
        "steam64Id",
        "name",
        "discordId",
        "username",
      ]);

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

/**
 * Edits event with id
 * PUT/edit/:eventId
 */
eventRouter.put(
  "/edit/:eventId",
  [auth, roles(["Admin", "Coach", "Manager", "Player"])],
  async (req: Request, res: Response) => {
    try {
      // Grab event from DB
      let event = await Event.findById(req.params.eventId);

      if (!event) {
        return res.status(404).json({
          error: {
            msg: `Event with id ${req.params.eventId} could not be found`,
          },
        });
      }

      // Deconstruct request
      const {
        name,
        type,
        format,
        attending,
        link,
        time,
        uploader,
        isCompleted,
      } = req.body;

      // Updated event
      const updatedEvent: any = {};

      !!name && (updatedEvent.name = name);
      !!type && (updatedEvent.type = type);
      !!format && (updatedEvent.format = format);
      !!attending && (updatedEvent.attending = attending);
      !!link && (updatedEvent.link = link);
      !!time && (updatedEvent.time = time);
      !!uploader && (updatedEvent.uploader = uploader);
      !!isCompleted && (updatedEvent.isCompleted = isCompleted);

      // Update event in DB
      event = await Event.findByIdAndUpdate(
        req.params.eventId,
        { $set: updatedEvent },
        { new: true }
      )
        .populate("attending", [
          "email",
          "steam64Id",
          "username",
          "discordId",
          "name",
        ])
        .populate("uploader", [
          "email",
          "steam64Id",
          "name",
          "discordId",
          "username",
        ]);

      res.status(200).json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          msg: `Server error while trying to edit event with id ${req.params.eventId}`,
        },
      });
    }
  }
);

/**
 * Delete event with id
 * DELETE/delete/:eventId
 */
eventRouter.delete(
  "/delete/:eventId",
  [auth, roles(["Admin", "Coach", "Manager", "Player"])],
  async (req: Request, res: Response) => {
    try {
      // Check event existence
      const event = await Event.findById(req.params.eventId);

      if (!event) {
        return res.status(404).json({
          error: {
            msg: `Event with id ${req.params.eventId} could not be found`,
          },
        });
      }

      // Delete event
      await Event.findByIdAndDelete(req.params.eventId);

      res.status(200).json({
        msg: `Event with id ${req.params.eventId} was successfully deleted`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: {
          msg: `Server error trying to delete event with id ${req.params.eventId}`,
        },
      });
    }
  }
);

/**
 * Gets all events from start time to end time
 * GET/ weekly/:startTime-:endTime
 */
eventRouter.get(
  "/weekly/:startTime&:endTime",
  auth,
  async (req: Request, res: Response) => {
    try {
      const startTime = req.params.startTime;
      const endTime = req.params.endTime;

      if (startTime === "" && endTime === "") {
        res.status(401).json({
          error: {
            msg: "Bad request: startTime and endTime cannot be empty",
          },
        });
      }

      // Convert string to date
      const startDate = new Date(new Date(startTime));
      const endDate = new Date(new Date(endTime).setHours(23, 59, 59));

      const events = await Event.find({
        time: {
          $gte: startDate,
          $lt: endDate,
        },
      }).sort({ time: 1 });

      // Grabs days between start and end date
      const getWeekRange = (start: Date, end: Date) => {
        let dateArray = [];
        for (
          let startDt: Date = new Date(start);
          startDt <= end;
          startDt.setDate(startDt.getDate() + 1)
        ) {
          dateArray.push({ [startDt.toISOString().slice(0, 10)]: [] });
        }
        return dateArray;
      };

      const weekRange = getWeekRange(startDate, endDate);

      // Takes sorted events and pushes them into their respective day
      events.forEach((event: any) => {
        weekRange.forEach((day: any) => {
          if (!!day[`${event.time.toISOString().slice(0, 10)}`]) {
            return day[`${event.time.toISOString().slice(0, 10)}`].push(event);
          }
        });
      });

      res.status(200).json(weekRange);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: { msg: "Server error trying to get weekly events" } });
    }
  }
);

export default eventRouter;
