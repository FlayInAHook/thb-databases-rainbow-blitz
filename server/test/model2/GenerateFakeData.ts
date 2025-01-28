import { faker } from '@faker-js/faker';
import { Document, Types } from 'mongoose';
import { AMOUNT_OF_GHOSTS, AMOUNT_OF_USERS } from '..';
import { TUser } from "./DBDefinitions";
import { addGhostData } from './GhostData';
import { registerCompleteUser, updateFullLevelData } from './User';


function generateFakeUsers(amount: number) {
  const users = faker.helpers.multiple(() => {
    const user: TUser = {
      username: faker.internet.username(),
      levelData: {},
      uniqueID: faker.string.uuid(),
      isDev: false
    }
    return user;
  }, {
    count: amount,
  });
  return users as unknown as TUser[];
}

function generateFakeLevelData(){
  return {
    1: {
      timeInMS: faker.number.int({min: 0, max: 10000}),
      ghostData: faker.string.alpha(10000)
    },
    2: {
      timeInMS: faker.number.int({min: 0, max: 10000}),
      ghostData: faker.string.alpha(10000)
    },
    3: {
      timeInMS: faker.number.int({min: 0, max: 10000}),
      ghostData: faker.string.alpha(10000)
    },
    7777: {
      timeInMS: faker.number.int({min: 0, max: 10000}),
      ghostData: faker.string.alpha(10000)
    },
  };
}

type User = Document<unknown, {}, TUser> & TUser & {
  _id: Types.ObjectId;
} & {
  __v: number;
}

function generateFakeGhostData(users: User[], amountOfGhosts: number) {
  let promises = [];
  for (const user of users) {
    const levelData = generateFakeLevelData();
    for (const levelID in levelData) {
      const currentLevelData = levelData[levelID as unknown as keyof typeof levelData];
      for (let i = 0; i < amountOfGhosts; i++) {
        promises.push(addGhostData(user.id, Number(levelID), currentLevelData.ghostData! + "EXTRA W/E".repeat(i), currentLevelData.timeInMS! + 1000 * i));
      }
    }
  }
  return promises;
}


export async function generateFakeData2(){
  console.log("Generating Fake Data");
  const users = generateFakeUsers(AMOUNT_OF_USERS);
  //console.log("Generated Fake Users", users[0]);
  console.log("Saving Fake Users");
  const newUsers = await Promise.all(users.map(user => registerCompleteUser(user)));

  const promises = generateFakeGhostData(newUsers, AMOUNT_OF_GHOSTS);

  const ghostData = await Promise.all(promises);
  console.log("Generated all Ghost Data", ghostData.length);

  let currentLevelData = {};


  ghostData.forEach(async (data, index) => {
    const modulo = index %  4 * AMOUNT_OF_GHOSTS;
    if (modulo == 0 || modulo % AMOUNT_OF_GHOSTS == 0) {
      currentLevelData = {
        ...currentLevelData,
        [data.levelID]: data._id
      }
      //console.log("Updating Full Level Data", data.userID);
    }
    if (modulo == AMOUNT_OF_GHOSTS * (4 - 1)) {
      //console.log(currentLevelData);
      await updateFullLevelData(data.userID, currentLevelData);
      currentLevelData = {};
    }
  });

}