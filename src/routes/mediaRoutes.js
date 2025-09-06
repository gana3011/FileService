import express from "express";
import { CheckAuth } from "../middleware/check-auth.js";
import multer from "multer";
import { media, streamUrl } from "../controller/mediaController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", CheckAuth, upload.single("file"), media);

router.get("/:id/stream-url", CheckAuth, streamUrl)

export default router;