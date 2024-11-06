import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";


export type UnityMessage = {
  type: "FINISHED_LEVEL" | "RESTART_LEVEL" | "PAUSE" | "UNIQUE_ID" | "OPEN_ESCAPE_MENU" | "LEVEL_ID";
  data: any;
}

export const timeAtom = atom(0);


export const customColorModeAtom = atomWithStorage<"light" | "dark">(
  "customColorMode",
  "dark"
);


export const requestUniqueID = () => {
  if (!window.vuplex) return console.error("No Vuplex Webview found!");
  window.vuplex.postMessage({type: "REQUEST_UNIQUE_ID"});
}