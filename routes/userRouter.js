const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { generateToken } = require("../util/generateToken");
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdatePasswordInput,
  validateResetPasswordInput,
} = require("../util/validator");
const { validateToken } = require("../util/validateToken");

const userRouter = express.Router();

userRouter.get("/", validateToken, (req, res) => {
  console.log(req.decoded);
  res.json({ message: "private route" });
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
    console.log(error.details.map((e) => e.message));
    // throw new Error(error.details.map((e) => e.message));
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
      // return res.json({ message: "User Already Exist" });
    } catch (error) {
      return res.json({ message: "Something went wrong !" });
    }
  } else {
    console.log(error.details.map((e) => e.message));
    // throw new Error(error.details.map((e) => e.message));
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

userRouter.put("/updatepassword", validateToken, async (req, res) => {
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
    // throw new Error(error.details.map((e) => e.message));
    return res.json({ message: error.details.map((e) => e.message) });
  }
});

userRouter.post("/resetpassword", async (req, res) => {
  const { email } = req.body;

  const { isValid, error } = await validateResetPasswordInput(email);
  console.log(email);
  res.send("ok");

  // if (isValid) {
  //   try {
  //     const user = await User.findById(id);
  //     if (user) {
  //       const match = await bcrypt.compare(oldPassword, user.password);
  //       if (!match) {
  //         return res.json({ message: "Please enter currect password !" });
  //       }
  //       await User.findByIdAndUpdate(id, {
  //         password: await bcrypt.hash(newPassword, 12),
  //       });
  //       return res.json({ message: "Password updated successfully !" });
  //     }
  //   } catch (error) {
  //     return res.json({ message: "Something went wrong !" });
  //   }
  // } else {
  //   // throw new Error(error.details.map((e) => e.message));
  //   return res.json({ message: error.details.map((e) => e.message) });
  // }
});

module.exports = userRouter;
