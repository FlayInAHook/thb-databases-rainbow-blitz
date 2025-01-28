import { Types } from "mongoose";
import { User } from "./DBDefinitions";

export async function getOneUser(uniqueID: Types.ObjectId) {
  const user = await User.findById(uniqueID).lean();
  return user;
}

export async function getOneUserPopulated(uniqueID: Types.ObjectId) {
  const user = await User.findById(uniqueID).populate("levelData").lean();
  return user;
}

export async function getTop10UsersForLevel(level: number) {
  const users = await User.aggregate([
    {
      $match: {
        [`levelData.${level}.timeInMS`]: {
          $exists: true
        }
      }
    },
    {
      $sort: {
        [`levelData.${level}.timeInMS`]: 1
      }
    },
    {
      $limit: 10
    },
  ]);
  return users;
}

export async function getTop10UsersForLevelPopulated(level: number) {
  // in this case levelData is a reference to another collection "ghostdata2"
  const users = await User.aggregate([
    {
      $lookup: {
        from: "ghostdata2",
        localField: `levelData.${level}.timeInMS`,
        foreignField: "_id",
        as: "populatedLevelData",
        pipeline: [
          {
            $project: {
              _id: 0,
              timeInMS: "$levelData.timeInMS",
              ghostData: "$levelData.ghostData" 
            }
          }
        ]
      }
    },
    {
      $addFields: {
        [`levelData.${level}.timeInMS`]: {
          $arrayElemAt: ["$populatedLevelData", 0] 
        }
      }
    },
    {
      $sort: {
        [`levelData.${level}.timeInMS`]: 1
      }
    },
    {
      $limit: 10
    }
  ]);
}



export async function getAllUsers() {
  const users = await User.find().lean();
  return users;
}

export async function performanceTestLeaderboard() {

  const time = Date.now();
  await getTop10UsersForLevel(7777);
  await getTop10UsersForLevel(1);
  await getTop10UsersForLevel(2);
  await getTop10UsersForLevel(3);

  return Date.now() - time;
}

export async function performanceTestOneUser(userNumber: number) {
  const user = (await getAllUsers())[userNumber];
  const time = Date.now();
  await getOneUser(user._id);
  return Date.now() - time;
}