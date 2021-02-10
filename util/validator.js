const Joi = require("joi");
module.exports.validateRegisterInput = async (username, email, password) => {
  const registerSchema = Joi.object().keys({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(5).max(50).optional(),
    password: Joi.string().min(8).required().strict(),
  });
  try {
    const { value, error } = await registerSchema.validate(
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
