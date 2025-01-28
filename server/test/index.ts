import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import CONIFG from "../config.json";
import { generateFakeData1 } from "./model1/GenerateFakeData";
import { performanceTestLeaderboard as performanceTestLeaderboard1, performanceTestOneUser as performanceTestOneUser1 } from "./model1/RequestsForPerformance";
import { generateFakeData2 } from "./model2/GenerateFakeData";
import { performanceTestLeaderboard as performanceTestLeaderboard2, performanceTestLeaderboardAlternative, performanceTestOneUser as performanceTestOneUser2 } from "./model2/RequestsForPerformance";



const dbConnection = await mongoose.connect(CONIFG.MONGODB_URL);
console.log("🚀 Connected to MongoDB");



export const AMOUNT_OF_USERS = 100;
export const AMOUNT_OF_GHOSTS = 10;
export const TESTS_PER_RUN = 50;

const userNumbers = faker.helpers.multiple(() => {
  return faker.number.int({min: 0, max: AMOUNT_OF_USERS - 1});
}, {
  count: TESTS_PER_RUN,
});

await generateFakeData();
await runTestsAlternating();

process.exit(0);

async function generateFakeData(){
  await generateFakeData1();
  console.log("🚀 Fake Data 1 Generated"); 

  await generateFakeData2();
  console.log("🚀 Fake Data 2 Generated");
}





async function runTestsAlternating() {
  console.log("🚀 Starting Alternating Performance Tests");
  console.log("🎲 Using these numbers: ", userNumbers);
  //log amount of users and ghosts
  console.log("👤 Amount of Users:", AMOUNT_OF_USERS);
  console.log("👻 Amount of Ghosts:", AMOUNT_OF_GHOSTS);

  const normalTestTimesLeaderboard1 = [];
  const normalTestTimesLeaderboard2 = [];
  const normalTestTimesLeaderboardAlternative2 = [];
  const parallelTestTimesLeaderboard1 = [];
  const parallelTestTimesLeaderboardd2 = [];
  const parallelTestTimesLeaderboardAlternative2 = [];
  const normalTestTimesOneUser1 = [];
  const normalTestTimesOneUser2 = [];

  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      console.log(`🏃 Run ${i + 1}: Starting with Performance Test 1`);
      const time1 = await runNormalPerformanceTestLeaderboard1();
      //const time2 = await runNormalPerformanceTestLeaderboard2();
      const timeAlternative2 = await runNormalPerformanceTestLeaderboardAlternative2();
      normalTestTimesLeaderboard1.push(time1);
      //normalTestTimesLeaderboard2.push(time2);
      normalTestTimesLeaderboardAlternative2.push(timeAlternative2);

      const parallelTime1 = await runParallelPerformanceTestLeaderboard1();
      //const parallelTime2 = await runParallelPerformanceTestLeaderboard2();
      const parallelTimeAlternative2 = await runParallelPerformanceTestLeaderboardAlternative2();
      parallelTestTimesLeaderboard1.push(parallelTime1);
      //parallelTestTimesLeaderboardd2.push(parallelTime2);
      parallelTestTimesLeaderboardAlternative2.push(parallelTimeAlternative2);

      const timeOneUser1 = await runNormalPerformanceTestOneUser1();
      const timeOneUser2 = await runNormalPerformanceTestOneUser2();
      normalTestTimesOneUser1.push(timeOneUser1);
      normalTestTimesOneUser2.push(timeOneUser2);

    } else {
      console.log(`🏃 Run ${i + 1}: Starting with Performance Test 2`);
      const timeAlternative2 = await runNormalPerformanceTestLeaderboardAlternative2();
      //const time2 = await runNormalPerformanceTestLeaderboard2();
      const time1 = await runNormalPerformanceTestLeaderboard1();
      normalTestTimesLeaderboard1.push(time1);
      //normalTestTimesLeaderboard2.push(time2);
      normalTestTimesLeaderboardAlternative2.push(timeAlternative2);

      const parallelTimeAlternative2 = await runParallelPerformanceTestLeaderboardAlternative2();
      //const parallelTime2 = await runParallelPerformanceTestLeaderboard2();
      const parallelTime1 = await runParallelPerformanceTestLeaderboard1();
      parallelTestTimesLeaderboard1.push(parallelTime1);
      //parallelTestTimesLeaderboardd2.push(parallelTime2);
      parallelTestTimesLeaderboardAlternative2.push(parallelTimeAlternative2);

      const timeOneUser2 = await runNormalPerformanceTestOneUser2();
      const timeOneUser1 = await runNormalPerformanceTestOneUser1();
      normalTestTimesOneUser1.push(timeOneUser1);
      normalTestTimesOneUser2.push(timeOneUser2);
    }
  }

  const averageNormalTime1 = normalTestTimesLeaderboard1.reduce((a, b) => a + b, 0) / normalTestTimesLeaderboard1.length;
  //const averageNormalTime2 = normalTestTimesLeaderboard2.reduce((a, b) => a + b, 0) / normalTestTimesLeaderboard2.length;
  const averageNormalTimeAlternative2 = normalTestTimesLeaderboardAlternative2.reduce((a, b) => a + b, 0) / normalTestTimesLeaderboardAlternative2.length;

  console.log("🕒 Normal Leaderboard Performance Test 1 Average Time:", averageNormalTime1);
  //console.log("🕒 Normal Leaderboard Performance Test 2 Average Time:", averageNormalTime2);
  console.log("🕒 Normal Leaderboard Performance Test Alternative 2 Average Time:", averageNormalTimeAlternative2);
  
  console.log("=====================================");

  const averageParallelTime1 = parallelTestTimesLeaderboard1.reduce((a, b) => a + b, 0) / parallelTestTimesLeaderboard1.length;
  //const averageParallelTime2 = parallelTestTimesLeaderboardd2.reduce((a, b) => a + b, 0) / parallelTestTimesLeaderboardd2.length;
  const averageParallelTimeAlternative2 = parallelTestTimesLeaderboardAlternative2.reduce((a, b) => a + b, 0) / parallelTestTimesLeaderboardAlternative2.length;

  console.log("🕒 Parallel Leaderboard Performance Test 1 Average Time:", averageParallelTime1);
  //console.log("🕒 Parallel Leaderboard Performance Test 2 Average Time:", averageParallelTime2);
  console.log("🕒 Parallel Leaderboard Performance Test Alternative 2 Average Time:", averageParallelTimeAlternative2);

  console.log("=====================================");

  const averageNormalTimeOneUser1 = normalTestTimesOneUser1.reduce((a, b) => a + b, 0) / normalTestTimesOneUser1.length;
  const averageNormalTimeOneUser2 = normalTestTimesOneUser2.reduce((a, b) => a + b, 0) / normalTestTimesOneUser2.length;

  console.log("🕒 Normal One User Performance Test 1 Average Time:", averageNormalTimeOneUser1)
  console.log("🕒 Normal One User Performance Test 2 Average Time:", averageNormalTimeOneUser2);
  process.exit(0);
}

async function runNormalPerformanceTestLeaderboard1() {
  const times = [];
  for (const userNumber of userNumbers) {
    const time = await performanceTestLeaderboard1();
    times.push(time);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runNormalPerformanceTestLeaderboard2() {
  const times = [];
  for (const userNumber of userNumbers) {
    const time = await performanceTestLeaderboard2();
    times.push(time);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runNormalPerformanceTestLeaderboardAlternative2() {
  const times = [];
  for (const userNumber of userNumbers) {
    const time = await performanceTestLeaderboardAlternative();
    times.push(time);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runParallelPerformanceTestLeaderboard1() {
  const times: number[] = [];
  await Promise.all(userNumbers.map(async (userNumber) => {
    const time = await performanceTestLeaderboard1();
    times.push(time);
  }));
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runParallelPerformanceTestLeaderboard2() {
  const times: number[] = [];
  await Promise.all(userNumbers.map(async (userNumber) => {
    const time = await performanceTestLeaderboard2();
    times.push(time);
  }));
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runParallelPerformanceTestLeaderboardAlternative2() {
  const times: number[] = [];
  await Promise.all(userNumbers.map(async (userNumber) => {
    const time = await performanceTestLeaderboardAlternative();
    times.push(time);
  }));
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runNormalPerformanceTestOneUser1() {
  const times = [];
  for (const userNumber of userNumbers) {
    const time = await performanceTestOneUser1(userNumber);
    times.push(time);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}

async function runNormalPerformanceTestOneUser2() {
  const times = [];
  for (const userNumber of userNumbers) {
    const time = await performanceTestOneUser2(userNumber);
    times.push(time);
  }
  return times.reduce((a, b) => a + b, 0) / times.length;
}