import { Schema, model } from "mongoose";

export type TLevelData = {
  timeInMS: number;
  ghostData: any;
}

export type TUser = {
  username: string;
  levelData: {
    [key: number]: TLevelData;
  }
  uniqueID: string;
  isDev: boolean;
}

const userSchema = new Schema<TUser>({
  username: {type: String, required: true, unique: true},
  levelData: {type: Object, required: true },
  uniqueID: {type: String, required: true},
  isDev: {type: Boolean, required: true}
});

export const User = model<TUser>("User", userSchema);