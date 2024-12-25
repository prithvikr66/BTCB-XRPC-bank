import { saveToDB } from "./utils";

export const handleBtcTxns = async (toast: any, data: any) => {
  try {
    console.log("saving")
    console.log(data.bitcoinHash)
    await saveToDB(data, data.bitcoinHash);
    toast({
      title: "Success",
      description: `Token transaction successful!`,
    });
    return;
  } catch (err) {
    console.log(err);
  }
};
