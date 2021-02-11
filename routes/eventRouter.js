const express = require("express");
const { eventNames } = require("../model/User");
const User = require("../model/User");
const Event = require("../model/Event");
const { validateToken } = require("../util/validateToken");
const {
  validateEventInput,
  validateInviteInput,
} = require("../util/validators/eventValidator");

const eventRouter = express.Router();

eventRouter.post("/createEvent", validateToken, async (req, res) => {
  let { eventName } = req.body;
  const { isValid, error } = await validateEventInput(eventName);
  if (isValid) {
    const { id } = req.decoded;
    try {
      const user = await User.findById(id);
      const event = await Event.create({ eventName, createdBy: user.username });
      if (user) {
        user.userEvents.push(event.id);
        await user.save();
        console.log(user);
      }
      return res.json({
        payload: event,
        message: "Event created successfully",
      });
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    console.log(error.details.map((e) => e.message));
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

eventRouter.get("/:userId/events", validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("userEvents");
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
});

eventRouter.put("/:eventId", validateToken, async (req, res) => {
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
      console.log(error);
      res.json({ message: "Something went wrong" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

eventRouter.get("/:userId/invitedEvents", validateToken, async (req, res) => {
  try {
    id = req.decoded;
    if (id.id !== req.params.userId) {
      return res.json({ message: "You are not allow to see others events" });
    }

    const user = await User.findById(req.params.userId);
    res.json(user.invitedEvents);
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
});

eventRouter.get("/:eventId", validateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.json({ message: "Event not found" });

    res.json({ message: "Event details", payload: event });
  } catch (error) {
    return res.json({ message: "Something went wrong" });
  }
});

eventRouter.put("/:eventId/updateEvent", validateToken, async (req, res) => {
  const { eventName } = req.body;
  const { isValid, error } = await validateEventInput(eventName);
  if (isValid) {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event) return res.json({ message: "Event not found" });

      event.eventName = eventName;
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
