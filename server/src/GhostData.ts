import { Schema } from "mongoose";
import { GhostData } from "./DBDefinitions";


export async function addGhostData(userID: Schema.Types.ObjectId, level: number, ghost: string, timeInMS: number) {
  
  const ghostData = new GhostData({
    levelID: level,
    userID: userID,
    levelData: {
      timeInMS,
      ghostData: ghost
    }
  });
  return await ghostData.save();
}