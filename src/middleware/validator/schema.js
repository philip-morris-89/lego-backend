import { body } from "express-validator";

const schema = [
  body("email").isEmail().withMessage("Email is wrong"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must contain min 6 and max 20 characters "),
];

export default schema;
