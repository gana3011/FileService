import express from "express";
import { body } from "express-validator";
import { RequestValidation } from "../middleware/request-validation.js";
import { signup } from "../controller/authController.js";
import { signin } from "../controller/authController.js";

const router = express.Router();

router.post("/signup",
    [
    body("email").notEmpty().isEmail().withMessage("Email must be valid"),
    body("password")
    .notEmpty()  
    .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 character"),
  ],
  RequestValidation,
  signup
)

router.post("/signin",
    [
    body("email").notEmpty().isEmail().withMessage("Email must be valid"),
    body("password")
    .notEmpty()  
    .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 to 20 character"),
  ],
  RequestValidation,
  signin
)

export default router;