const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../model/User");
const { mailSender } = require("../util/mailSender");
const { generateToken } = require("../util/generateToken");
const { paginatedResult } = require("../middleware/pagination");
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdatePasswordInput,
  validateResetPasswordInput,
  validateChangePasswordInput,
} = require("../util/validators/userValidator");
const { verifyUser } = require("../middleware/verifyUser");

const userRouter = express.Router();

userRouter.get("/users", paginatedResult(User), async (req, res) => {
  const user = await User.find();

  res.json({ message: "All Users", payload: user });
});

userRouter.post("/register", async (req, res) => {
  let { username, email, password } = req.body;
  const { isValid, error } = await validateRegisterInput(
    username,
    email,
    password
  );

  if (isValid) {
    try {
      const userAlreadyExist = await User.findOne({ email });
      if (!userAlreadyExist) {
        // hash password and createa an auth token
        password = await bcrypt.hash(password, 12);

        const user = await User.create({ username, email, password });
        const token = generateToken(user);

        return res.json({
          payload: { ...user._doc, token },
          message: "User register successfully",
        });
      }

      return res.json({ message: "User Already Exist" });
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { isValid, error } = await validateLoginInput(email, password);

  if (isValid) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.json({ message: "Email or password is wrong !" });
      }
      const token = generateToken(user);

      return res.json({
        payload: { ...user._doc, token },
        message: "User login successfully",
      });
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

userRouter.put("/updatepassword", verifyUser, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const { isValid, error } = await validateUpdatePasswordInput(
    oldPassword,
    newPassword
  );

  if (isValid) {
    try {
      const { id } = req.decoded;
      if (id) {
        const user = await User.findById(id);
        if (user) {
          const match = await bcrypt.compare(oldPassword, user.password);
          if (!match) {
            return res.json({ message: "Please enter currect password !" });
          }
          await User.findByIdAndUpdate(id, {
            password: await bcrypt.hash(newPassword, 12),
          });
          return res.json({ message: "Password updated successfully " });
        }
      }
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

userRouter.post("/resetpassword", async (req, res) => {
  const { email } = req.body;

  const { isValid, error } = await validateResetPasswordInput(email);
  if (isValid) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = crypto.randomBytes(20).toString("hex");
        await user.updateOne({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 60000,
        });
        await mailSender(email, token, user.username);
        return res.json({
          message: "Reset password link send to on your register mail",
        });
      } else {
        return res.json({ message: "Email is not exist in database" });
      }
    } catch (error) {
      return res.json({ message: "Something went wrong" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

userRouter.put("/changepassword/:token", async (req, res) => {
  const { newPassword } = req.body;

  const { isValid, error } = await validateChangePasswordInput(newPassword);
  if (isValid) {
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });
      if (user) {
        await user.updateOne({
          password: await bcrypt.hash(newPassword, 12),
        });
        return res.json({
          message: "Password reset sucessfully",
        });
      } else {
        return res.json({
          message: "You are not authorize to reset the password",
        });
      }
    } catch (error) {
      return res.json({ message: "Something went wrong" });
    }
  } else {
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

module.exports = userRouter;
