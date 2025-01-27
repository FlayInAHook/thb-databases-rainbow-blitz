import { faker } from '@faker-js/faker';
import { Document, Types } from 'mongoose';
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

function generateFakeGhostData(users: User[]) {
  let promises: Promise<any>[] = [];
  for (const user of users) {
    for (const levelID in user.levelData) {
      promises.push(addGhostData(user.id, Number(levelID), user.levelData[levelID].ghostData!, user.levelData[levelID].timeInMS!));
      promises.push(addGhostData(user.id, Number(levelID), user.levelData[levelID].ghostData!+ "EXTRA W/E" , user.levelData[levelID].timeInMS! + 1000));
      promises.push(addGhostData(user.id, Number(levelID), user.levelData[levelID].ghostData!+ "EXTRA W/E EXTRA W/E" , user.levelData[levelID].timeInMS! + 2000));
    }
  }
  return promises;
}


export async function generateFakeData1(){
  console.log("Generating Fake Data");
  const users = generateFakeUsers(1000);
  //console.log("Generated Fake Users", users[0]);
  console.log("Saving Fake Users");
  const newUsers = await Promise.all(users.map(user => registerCompleteUser(user)));

  const promises: Promise<any>[] = generateFakeGhostData(newUsers);

 


  return Promise.all(promises);


}