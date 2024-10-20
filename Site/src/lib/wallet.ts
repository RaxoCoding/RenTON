// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { CHAIN, TonConnectUI, UserRejectsError } from "@tonconnect/ui-react";
import { Sender } from "@ton/core";
import tonweb from "tonweb";

export const sender = (tonConnectUI: TonConnectUI): Sender => {
  return {
    send: async (transaction) => {
      try {
        await tonConnectUI.sendTransaction({
					network: CHAIN.TESTNET,
          validUntil: Date.now() + 5 * 60 * 1000,
          messages: [
            {
              address: transaction.to.toString(),
              amount: transaction.value.toString(),
              payload: tonweb.utils.bytesToBase64(transaction.body?.toBoc(false) as unknown as Uint8Array), // Base64-encoded BOC
            },
          ],
        });
      } catch (error) {
        if (error instanceof UserRejectsError) {
          console.error("Transaction rejected by user");
        } else {
          console.error("Error sending transaction:", error);
        }
      }
    },
  };
};
