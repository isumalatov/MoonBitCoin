import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  email: string;
  bitcoin: number;
  bnb: number;
  dash: number;
  dogecoin: number;
  litecoin: number;
}

const UserSchema = new mongoose.Schema<Users>({
  email: { type: String, required: true },
  bitcoin: { type: Number, required: true },
  bnb: { type: Number, required: true },
  dash: { type: Number, required: true },
  dogecoin: { type: Number, required: true },
  litecoin: { type: Number, required: true },
});

export default mongoose.models.User ||
  mongoose.model<Users>("User", UserSchema);
