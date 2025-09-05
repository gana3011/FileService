import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes.js"; 

const app = express();

app.use(bodyParser.json())

app.use("/auth", authRoutes);

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});
