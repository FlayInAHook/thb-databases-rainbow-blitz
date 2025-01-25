import { faker } from '@faker-js/faker';
import { Document, Types } from 'mongoose';
import { TUser } from "../../src/DBDefinitions";
import { addGhostData } from '../../src/GhostData';


function generateFakeUsers(amount: number) {
  const users = faker.helpers.multiple(() => {
    const user: TUser = {
      username: faker.internet.username(),
      levelData: {
        1: {
          timeInMS: faker.number.int({min: 0, max: 10000}),
          ghostData: faker.string.alpha(2000)
        },
        2: {
          timeInMS: faker.number.int({min: 0, max: 10000}),
          ghostData: faker.string.alpha(2000)
        },
        3: {
          timeInMS: faker.number.int({min: 0, max: 10000}),
          ghostData: faker.string.alpha(2000)
        },
        7777: {
          timeInMS: faker.number.int({min: 0, max: 10000}),
          ghostData: faker.string.alpha(2000)
        },
      },
      uniqueID: faker.string.uuid(),
      isDev: false
    }
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
  for (const user of users) {
    for (const levelID in user.levelData) {
      addGhostData(user.id, Number(levelID), user.levelData[levelID].ghostData!, user.levelData[levelID].timeInMS!);
    }
  }
}