import { saveToDB } from "./utils";

export const handleBtcTxns = async (toast: any, data: any) => {
  try {
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
