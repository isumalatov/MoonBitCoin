import mongoose from "mongoose";

export interface Users extends mongoose.Document {
  email: string;
  bitcoin: number;
  bnb: number;
  dash: number;
  dogecoin: number;
  litecoin: number;
  lastclaimbitcoin: Date;
  lastclaimbnb: Date;
  lastclaimdash: Date;
  lastclaimdogecoin: Date;
  lastclaimlitecoin: Date;
  dailybonusbitcoin: number;
  dailybonusbnb: number;
  dailybonusdash: number;
  dailybonusdogecoin: number;
  dailybonuslitecoin: number;
}

const UserSchema = new mongoose.Schema<Users>({
  email: { type: String, required: true },
  bitcoin: { type: Number, required: true },
  bnb: { type: Number, required: true },
  dash: { type: Number, required: true },
  dogecoin: { type: Number, required: true },
  litecoin: { type: Number, required: true },
  lastclaimbitcoin: { type: Date, required: true },
  lastclaimbnb: { type: Date, required: true },
  lastclaimdash: { type: Date, required: true },
  lastclaimdogecoin: { type: Date, required: true },
  lastclaimlitecoin: { type: Date, required: true },
  dailybonusbitcoin: { type: Number, required: true },
  dailybonusbnb: { type: Number, required: true },
  dailybonusdash: { type: Number, required: true },
  dailybonusdogecoin: { type: Number, required: true },
  dailybonuslitecoin: { type: Number, required: true },
});

export default mongoose.models.User ||
  mongoose.model<Users>("User", UserSchema);
