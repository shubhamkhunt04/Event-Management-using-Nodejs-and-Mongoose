// Event Validation
const Joi = require("joi");

module.exports.validateEventInput = async (eventName) => {
  const eventSchema = Joi.object().keys({
    eventName: Joi.string().min(3).required(),
  });
  try {
    const { error } = await eventSchema.validate(
      {
        eventName,
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

module.exports.validateInviteInput = async (email) => {
  const resetPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
  });
  try {
    const { error } = await resetPasswordSchema.validate(
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
