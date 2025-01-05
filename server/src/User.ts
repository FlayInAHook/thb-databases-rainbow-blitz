import Elysia, { t } from 'elysia';
import { TLevelData, User } from "./DBDefinitions";

async function registerUser(username: string, uniqueID: string) {
  const user = new User({username, levelData: {}, uniqueID, isDev: false});
  return await user.save();
}

async function updateScore(uniqueID: string, level: number, timeInMS: number) {
  const user = await User.findOne({
    uniqueID
  });
  if (!user) {
    throw new Error("User not found");
  }
  const newUserData = {
    ...user.levelData || {},
    [level]: {
      timeInMS,
      ghostData: user.levelData?.[level]?.ghostData || null
    }
  };
  user.levelData = newUserData;
  return await user.save();
}

async function updateGhostData(uniqueID: string, level: number, ghostData: any) {
  const user = await User.findOne({
    uniqueID
  });
  if (!user) {
    throw new Error("User not found");
  }
  const newUserData = {
    ...user.levelData || {},
    [level]: {
      timeInMS: user.levelData?.[level]?.timeInMS || null,
      ghostData: ghostData
    }
  };
  user.levelData = newUserData;
  return await user.save();
}

export const userRoutes = new Elysia();


userRoutes.get("/user/:uniqueID", async ({params: {uniqueID}}) => {
  console.log(uniqueID + " is the uniqueID")
  const result = await User.findOne({uniqueID}, {_id: 0, __v: 0}).lean() || {};
  return result;
});

userRoutes.post("/user", async ({body: {username, uniqueID}}) => {
  const user = await registerUser(username, uniqueID);
  return user.toJSON();
}, {
    body: t.Object(
    {
      username: t.String(),
      uniqueID: t.String()
    }
  )
});

userRoutes.post("/user/score", async ({body: {uniqueID, level, timeInMS}}) => {
  console.log(uniqueID, level, timeInMS)
  const user = await updateScore(uniqueID, level, timeInMS);
  console.log(user);
  return user.toJSON();
}, {
  body: t.Object(
    {
      uniqueID: t.String(),
      level: t.Number(),
      timeInMS: t.Number()
    }
  )
});

userRoutes.post("/user/ghost", async ({body: {uniqueID, level, ghostData}}) => {
  const user = await updateGhostData(uniqueID, level, ghostData);
  return user.toJSON();
}, {
  body: t.Object(
    {
      uniqueID: t.String(),
      level: t.Number(),
      ghostData: t.Any()
    }
  )
});

// fetch leaderboard (top 10) for all levels
userRoutes.get("/leaderboard", async () => {
  const users = await User.find({}, {_id: 0, __v: 0}).lean();
  const leaderboard: Record<string, any> = {};
  users.forEach(user => {
    Object.entries(user.levelData ?? {}).forEach(([level, {timeInMS}]) => {
      if (!leaderboard[level]) {
        leaderboard[level] = [];
      }
      leaderboard[level].push({
        username: user.username,
        timeInMS
      });
    });
  });

  Object.entries(leaderboard).forEach(([level, scores]) => {
    scores.filter((score: TLevelData) => score.timeInMS !== null);
    scores.sort((a: TLevelData, b: TLevelData) => a.timeInMS! - b.timeInMS!);
    leaderboard[level] = scores.slice(0, 10);
  });
  return leaderboard;
});