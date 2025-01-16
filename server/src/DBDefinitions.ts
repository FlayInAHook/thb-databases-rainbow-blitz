import { Schema, model } from "mongoose";

export type TLevelData = {
  timeInMS: number | null;
  ghostData: string | null;
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

export type TGhostData = {
  levelID: number;
  ghostData: any;
  userID: Schema.Types.ObjectId;
}

const ghostDataSchema = new Schema<TGhostData>({
  levelID: {type: Number, required: true},
  ghostData: {type: String, required: true},
  userID: {type: Schema.Types.ObjectId, ref: "User"}
});

export const GhostData = model<TGhostData>("GhostData", ghostDataSchema);

