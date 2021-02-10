const express = require("express");
const bodyParser = require("body-parser");
const User = require("../model/User");
const { validateRegisterInput } = require("../util/validator");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const { isValid, error } = await validateRegisterInput(
    username,
    email,
    password
  );

  if (isValid) {
    try {
      const userAlreadyExist = await User.findOne({ email });
      if (!userAlreadyExist) {
        const user = await User.create(req.body);
        return res.json({
          payload: user,
          message: "User created successfully",
        });
      }
      return res.json({ message: "User Already Exist" });
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    console.log(error.details.map((e) => e.message));
    // throw new Error(error.details.map((e) => e.message));
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

module.exports = userRouter;
