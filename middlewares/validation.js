const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// create validation functions for
// - the clothing item body when an item is created
//   - the item name is a required string between 2 and 30 characters
//   - an image url is a required string in a URL format

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

// - the user info body when a user is created
//   - the user name is a string between 2 and 30 characters
//   - the user avater is a required sring in a URL format
//   - email is a required string in a valid email format
//   - password is a required string

module.exports.validateCreatedUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
      "string.empty": 'The "imageUrl" field must be filled in',
    }),
    email: Joi.string().required().email().messages({
      "string.email": "Please use a valid email",
      "string.empty": "please enter a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "please enter a password",
    }),
  }),
});

// - authentication when a user logs in
//   - email is a required string in a valid email format
//   - password is a required string

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Please use a valid email",
      "string.empty": "please enter a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "please enter a password",
    }),
  }),
});

// - user and clothing item IDs when the are accessed
//   - Ids must be a hexadecimal value length of 24 characters

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().alphanum().length(24),
  }),
});

module.exports.validateUpdatedProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.uri": 'the "imageUrl" field must be a valid url',
      "string.empty": 'The "imageUrl" field must be filled in',
    }),
  }),
});
