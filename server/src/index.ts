import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import CONIFG from "../config.json";
import { ghostRoutes } from "./GhostData";
import { userRoutes } from "./User";


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
