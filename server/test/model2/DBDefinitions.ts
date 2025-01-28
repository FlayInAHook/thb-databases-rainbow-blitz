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

// leveldata should reference the ghostdata schema
const userSchema = new Schema<TUser>({
  username: {type: String, required: true, unique: true},
  uniqueID: {type: String, required: true},
  isDev: {type: Boolean, required: true},
  levelData: {
    type: Map,
    of: {type: Schema.Types.ObjectId, ref: "GhostData2"}
  }
});

export const User = model<TUser>("User2", userSchema);

export type TGhostData = {
  levelID: number;
  userID: Schema.Types.ObjectId;
  levelData: TLevelData;
}

const ghostDataSchema = new Schema<TGhostData>({
  levelID: {type: Number, required: true},
  userID: {type: Schema.Types.ObjectId, ref: "User2"},
  levelData: {type: Object, required: true}
});

export const GhostData = model<TGhostData>("GhostData2", ghostDataSchema);

