import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import CONIFG from "../config.json";
import { ghostRoutes } from "../src/GhostData";
import { userRoutes } from "../src/User";


const dbConnection = await mongoose.connect(CONIFG.MONGODB_URL);
console.log("🚀 Connected to MongoDB");


const app = new Elysia()
  .use(cors())
  .use(userRoutes)
  .use(ghostRoutes)
  .listen(CONIFG.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
