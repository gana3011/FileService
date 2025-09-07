import express from "express";
import { CheckAuth } from "../middleware/check-auth.js";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { analytics, logView, media, streamUrl } from "../controller/mediaController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

export const viewLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  message: { message: "Too many view logs from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post("/", CheckAuth, upload.single("file"), media);

router.get("/:id/stream-url", CheckAuth, streamUrl)

router.post("/:id/view", CheckAuth, viewLimiter, logView);

router.get("/:id/analytics", CheckAuth, analytics);

export default router;