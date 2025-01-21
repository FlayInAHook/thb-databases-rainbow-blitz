import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type LevelData = {
  timeInMS: number;
  ghostData: String | null;
}

export type User = {
  username: string;
  levelData: {
    [key: number]: LevelData;
  }
  uniqueID: string;
  isDev: boolean;
}

export type GhostData = {
  levelID: number;
  userID: string;
  levelData: LevelData;
}

export type UnityMessage = {
  type: "FINISHED_LEVEL" | "RESTART_LEVEL" | "PAUSE" | "UNIQUE_ID" | "OPEN_ESCAPE_MENU" | "LEVEL_ID" | "LEVEL_TRACE";
  data: any;
}

export const timeAtom = atom(0);

export const userAtom = atom<User | null>(null);


export const customColorModeAtom = atomWithStorage<"light" | "dark">(
  "customColorMode",
  "dark"
);


export const requestUniqueID = () => {
  if (!window.vuplex) return console.error("No Vuplex Webview found!");
  window.vuplex.postMessage({type: "REQUEST_UNIQUE_ID"});
}

//export const API_URL = "https://rainbowblitzui.flayinahook.de/api/"; //"http://localhost:3000"; 
export const API_URL = "http://localhost:3000";
export const USER_URL = `${API_URL}/user`;

export const fetchUser = async (uniqueID: string): Promise<User> => {
  const response = await fetch(`${USER_URL}/${uniqueID}`);
  const data = await response.json();
  return data;
}

export const registerUser = async (uniqueID: string, username: string): Promise<User> => {
  const response = await fetch(USER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({uniqueID, username})
  });
  const data = await response.json();
  console.log("register data:", data);
  return data;
}

export const saveNewHighscore = async (uniqueID: string, levelID: number, timeInMS: number): Promise<User> => {
  console.log("saveNewHighscore", uniqueID, levelID, timeInMS);
  console.log("URL", `${USER_URL}/${uniqueID}/score`);
  const response = await fetch(`${USER_URL}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({level: levelID, timeInMS, uniqueID})
  });
  const data = await response.json();
  return data;
}

export const saveGhostData = async (uniqueID: string, levelID: number, ghostData: any, timeInMS: number): Promise<User> => {
  console.log("saveGhostData"); 
  const response = await fetch(`${USER_URL}/ghost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({level: levelID, ghostData, uniqueID, timeInMS})
  });
  const data = await response.json();
  return data;
}

export const getAllLeaderboards = async () => {
  const response = await fetch(`${API_URL}/leaderboard`);
  const data = await response.json();
  return data;
}

export const getUserHighscoreOrNull = (user: User | null, levelID: number): number | null => {
  return user?.levelData && user.levelData.hasOwnProperty(levelID)
  ? user.levelData[levelID]?.timeInMS ?? null
  : null;
}

export const getAllGhostData = async (): Promise<GhostData[]> => {
  const response = await fetch(`${API_URL}/ghostData`);
  const data = await response.json();
  return data;
}

export const getGhostDataForLevel = async (levelID: number): Promise<GhostData[]> => {
  const response = await fetch(`${API_URL}/ghostData/${levelID}`);
  const data = await response.json();
  return data;
}