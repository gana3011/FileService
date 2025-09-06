import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js"; 
import mediaRoutes from "./src/routes/mediaRoutes.js"; 
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SERVICE_ROLE_KEY
)

app.locals.supabase = supabase;

app.use(bodyParser.json())

app.use("/auth", authRoutes);

app.use("/media", mediaRoutes);

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});
