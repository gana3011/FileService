import express from "express";
import { CheckAuth } from "../middleware/check-auth.js";
import multer from "multer";
import { media } from "../controller/mediaController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", CheckAuth, upload.single("file"), media);

export default router;