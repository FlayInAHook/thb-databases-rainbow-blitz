import { Schema } from "mongoose";
import { GhostData } from "./DBDefinitions";


export async function addGhostData(userID: Schema.Types.ObjectId, level: number, ghost: string) {
  
  const ghostData = new GhostData({
    levelID: level,
    userID: userID,
    ghostData: ghost
  });
  return await ghostData.save();
}