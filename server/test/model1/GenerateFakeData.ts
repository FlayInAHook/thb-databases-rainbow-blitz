import { faker } from '@faker-js/faker';
import { Document, Types } from 'mongoose';
import { AMOUNT_OF_GHOSTS, AMOUNT_OF_USERS } from '..';
import { TUser } from "./DBDefinitions";
import { addGhostData } from './GhostData';
import { registerCompleteUser } from './User';


function generateFakeUsers(amount: number) {
  const users = faker.helpers.multiple(() => {
    const user: TUser = {
      username: faker.internet.username(),
      levelData: {
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
      },
      uniqueID: faker.string.uuid(),
      isDev: false
    }
    return user;
  }, {
    count: amount,
  });
  return users as unknown as TUser[];
}

type User = Document<unknown, {}, TUser> & TUser & {
  _id: Types.ObjectId;
} & {
  __v: number;
}

function generateFakeGhostData(users: User[], amountOfGhosts: number) {
  let promises: Promise<any>[] = [];
  for (const user of users) {
    for (const levelID in user.levelData) {
      for (let i = 0; i < amountOfGhosts; i++) {
        promises.push(addGhostData(user.id, Number(levelID), user.levelData[levelID].ghostData! + "EXTRA W/E".repeat(i), user.levelData[levelID].timeInMS! + 1000 * i));
      }
    }
  }
  return promises;
}




export async function generateFakeData1(){
  console.log("Generating Fake Data");
  const users = generateFakeUsers(AMOUNT_OF_USERS);
  //console.log("Generated Fake Users", users[0]);
  console.log("Saving Fake Users");
  const newUsers = await Promise.all(users.map(user => registerCompleteUser(user)));

  const promises: Promise<any>[] = generateFakeGhostData(newUsers, AMOUNT_OF_GHOSTS);

  return Promise.all(promises);
}