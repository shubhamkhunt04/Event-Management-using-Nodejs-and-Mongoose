const express = require("express");
const User = require("../model/User");
const Event = require("../model/Event");
const { verifyUser } = require("../middleware/verifyUser");
const {
  validateEventInput,
  validateInviteInput,
} = require("../util/validators/eventValidator");
const { paginatedResult } = require("../middleware/pagination");

const eventRouter = express.Router();

eventRouter.post("/createEvent", verifyUser, async (req, res) => {
  let { eventName, time, description } = req.body;
  const { isValid, error } = await validateEventInput(
    eventName,
    time,
    description
  );
  if (isValid) {
    const { id } = req.decoded;
    try {
      const user = await User.findById(id);
      const event = await Event.create({
        eventName,
        time,
        description,
        createdBy: user.username,
      });
      if (user) {
        user.userEvents.push(event.id);
        await user.save();
      }
      return res.json({
        payload: event,
        message: "Event created successfully",
      });
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

eventRouter.get(
  "/events",
  verifyUser,
  paginatedResult(Event),
  async (req, res) => {
    try {
      const { id } = req.decoded;
      const user = await User.findById(id).populate("userEvents");
      if (user) {
        return res.json({
          payload: user.userEvents,
          message: "User Events",
        });
      }
      return res.json({ message: "User not found" });
    } catch (error) {
      res.json({ message: "Something went wrong" });
    }
  }
);

eventRouter.put("/:eventId", verifyUser, async (req, res) => {
  const { email } = req.body;
  const { isValid, error } = await validateInviteInput(email);
  if (isValid) {
    try {
      const event = await Event.findById(req.params.eventId);
      const user = await User.findOne({ email });

      if (!event) {
        return res.json({ message: "Event not found" });
      }

      if (!user) {
        return res.json({
          message:
            "Please enter email who is registered user on event management",
        });
      }

      if (event.invitedUsers.includes(email)) {
        return res.json({ message: "You have already invited" });
      }
      user.invitedEvents.push({
        eventName: event.eventName,
        createdAt: event.createdAt,
        createdBy: event.createdBy,
      });
      await user.save();

      event.invitedUsers.push(email);
      await event.save();
      return res.json({
        payload: event.invitedUsers,
        message: "Invited Successfully",
      });
    } catch (error) {
      res.json({ message: "Something went wrong" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

eventRouter.get("/invitedEvents", verifyUser, async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findById(id);
    res.json(user.invitedEvents);
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
});

eventRouter.get("/:eventId", verifyUser, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.json({ message: "Event not found" });

    res.json({ message: "Event details", payload: event });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
});

eventRouter.put("/:eventId/updateEvent", verifyUser, async (req, res) => {
  const { eventName, time, description } = req.body;
  const { isValid, error } = await validateEventInput(
    eventName,
    time,
    description
  );
  if (isValid) {
    try {
      const userId = req.decoded;
      const user = User.findById(userId.id);
      // Not update others event
      if (!user.userEvents.includes(req.params.eventId))
        return res.json({ message: "Not allowed to update event details" });

      const event = await Event.findById(req.params.eventId);
      if (!event) return res.json({ message: "Event not found" });

      event.eventName = eventName;
      (event.time = time), (event.description = description);
      await event.save();
      res.json({ message: "Event details updated", payload: event });
    } catch (error) {
      return res.json({ message: "Something went wrong" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

module.exports = eventRouter;
