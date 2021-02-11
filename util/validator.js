const Joi = require("joi");

module.exports.validateRegisterInput = async (username, email, password) => {
  const registerSchema = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string().min(8).required().strict(),
  });
  try {
    const { error } = await registerSchema.validate(
      {
        username,
        email,
        password,
      },
      { abortEarly: false }
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    console.log(err);
    return { message: "Something wents wrong !" };
  }
};

module.exports.validateLoginInput = async (email, password) => {
  const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  try {
    const { error } = await loginSchema.validate(
      {
        email,
        password,
      },
      { abortEarly: false }
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    console.log(err);
    return { message: "Something wents wrong !" };
  }
};

module.exports.validateUpdatePasswordInput = async (
  oldPassword,
  newPassword
) => {
  const loginSchema = Joi.object().keys({
    oldPassword: Joi.string().min(8).required().strict(),
    newPassword: Joi.string().min(8).required().strict(),
  });
  try {
    const { error } = await loginSchema.validate(
      {
        oldPassword,
        newPassword,
      },
      { abortEarly: false }
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    console.log(err);
    return { message: "Something wents wrong !" };
  }
};

module.exports.validateResetPasswordInput = async (email) => {
  const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  try {
    const { error } = await loginSchema.validate(
      {
        email,
      },
      { abortEarly: false }
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    console.log(err);
    return { message: "Something wents wrong !" };
  }
};

module.exports.validateChangePasswordInput = async (password) => {
  const loginSchema = Joi.object().keys({
    password: Joi.string().min(8).required().strict(),
  });
  try {
    const { error } = await loginSchema.validate(
      {
        password,
      },
      { abortEarly: false }
    );
    if (error) {
      return { isValid: false, error };
    }
    return { isValid: true };
  } catch (err) {
    console.log(err);
    return { message: "Something wents wrong !" };
  }
};
