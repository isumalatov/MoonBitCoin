export interface UserData {
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

export interface UserDataClaim {
  dailybonus:number
  currentclaim:number
}