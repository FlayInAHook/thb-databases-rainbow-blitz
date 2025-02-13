import Elysia from "elysia";
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


export const ghostRoutes = new Elysia();

//getall
ghostRoutes.get("/ghostData", async () => {
  const result = await GhostData.find({}, {_id: 0, __v: 0}).lean() || {};
  return result;
});

ghostRoutes.get("/ghostData/:levelID", async ({params: {levelID}}) => {
  const result = await GhostData.aggregate([
    {
      $match: {
        levelID: parseInt(levelID)
      }
    },
    {
      $sort: {
        "levelData.timeInMS": 1
      }
    },
    {
      $group: {
        _id: "$userID",
        levelData: {
          $first: "$levelData"
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          userID: "$_id",
          levelData: "$levelData"
        }
      }
    },
    {
      $limit: 1
    }
  ]);
  return result;
});