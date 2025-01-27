
import mongoose from "mongoose";
import CONIFG from "../config.json";
import { generateFakeData1 } from "./model1/GenerateFakeData";



const dbConnection = await mongoose.connect(CONIFG.MONGODB_URL);
console.log("🚀 Connected to MongoDB");


function generateFakeData(){
  generateFakeData1().then(() => {
    console.log("🚀 Fake Data Generated"); 
  }).catch((e) => {
    console.error(e);
  });
}