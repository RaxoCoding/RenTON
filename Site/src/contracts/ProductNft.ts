// @ts-nocheck

import {
  Address,
  Cell,
  Builder,
  Dictionary,
  TupleBuilder,
  Sender,
  toNano,
  TonClient
} from "ton"; // Make sure to install 'ton-core' package
import { tonClient } from "./connection";

// Define the types used in the contract
type InitNft = {
  $$type: "InitNft";
  owner: Address;
  customer: Address;
  productStake: bigint;
  productName: string;
  productDescription: string;
  descriptionImageUrl: string;
};

type Deploy = {
  $$type: "Deploy";
  queryId: bigint;
};

// The main ProductNft class
export class ProductNft {
  private address: Address;
  private client: TonClient;

  constructor(contractAddress: string) {
    this.address = Address.parse(contractAddress);
    this.client = tonClient;
  }

  // Method to check if the contract is deployed
  async isDeployed() {
    const isDeployed = await this.client.isContractDeployed(this.address);
    if (!isDeployed) {
      throw new Error("Contract is not deployed.");
    }
  }

  // Helper function to serialize InitNft messages
  private storeInitNft(message: InitNft): Cell {
    const builder = new Builder();
    // Assuming the op code for InitNft is 3844277486 (from your contract)
    builder.storeUint(3844277486, 32); // op code for InitNft
    builder.storeAddress(message.owner);
    builder.storeAddress(message.customer);
    builder.storeCoins(message.productStake);
    builder.storeStringRefTail(message.productName);
    builder.storeStringRefTail(message.productDescription);
    builder.storeStringRefTail(message.descriptionImageUrl);
    return builder.endCell();
  }

  // Helper function to serialize Deploy messages
  private storeDeploy(message: Deploy): Cell {
    const builder = new Builder();
    builder.storeUint(2490013878, 32); // op code for Deploy (replace if different)
    builder.storeUint(message.queryId, 64);
    return builder.endCell();
  }

  // The send function adjusted to include helper functions
  async send(
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message: InitNft | Deploy
  ) {
    let body: Cell | null = null;

    if (message.$$type === "InitNft") {
      body = this.storeInitNft(message);
    } else if (message.$$type === "Deploy") {
      body = this.storeDeploy(message);
    } else {
      throw new Error("Invalid message type");
    }

    // Send the message via the sender
    await via.send({
      to: this.address,
      value: args.value,
      bounce: args.bounce ?? false,
      body: body,
    });
  }

  // Method to mint a new NFT
  async mintNft(
    via: Sender,
    owner: Address,
    customer: Address,
    productStake: bigint,
    productName: string,
    productDescription: string,
    descriptionImageUrl: string,
    amount: bigint = toNano("0.05") // Default amount to send
  ) {
    // Create the InitNft message
    const message: InitNft = {
      $$type: "InitNft",
      owner,
      customer,
      productStake,
      productName,
      productDescription,
      descriptionImageUrl,
    };

    // Send the message to the contract
    await this.send(
      via,
      { value: amount, bounce: false },
      message
    );
  }

  // Method to get NFT addresses
  async getNftAddresses(): Promise<{ id: bigint; address: string }[]> {
    await this.isDeployed();

    const result = await this.client.runMethod(this.address, "getNftAddresses");

    if (result && result.stack) {
      let addresses = Dictionary.loadDirect(
        Dictionary.Keys.BigInt(257),
        Dictionary.Values.Address(),
        result.stack.readCellOpt()
      );

      const nftList: { id: bigint; address: string }[] = [];  
      for (let [id, addr] of addresses) {
        nftList.push({ id: id, address: addr.toString() });
      }

      return nftList;
    } else {
      throw new Error("Failed to get NFT addresses");
    }
  }

  // Add other methods as needed, including helper functions
  // For example, getNftAddressById, getNftInit, etc.

  // Helper function to call contract methods
  private async callGetMethod(
    methodName: string,
    params: TupleBuilder
  ): Promise<any> {
    const result = await this.client.runMethod(
      this.address,
      methodName,
      params.build()
    );

    return result.stack;
  }

  // Example: Get NFT Address by ID
  async getNftAddressById(nftId: bigint): Promise<string> {
    await this.isDeployed();

    const params = new TupleBuilder();
    params.writeNumber(nftId);

    const stack = await this.callGetMethod("getNftAddress", params);
    const address = stack.readAddress();
    return address.toString();
  }

  // Example: Get NFT Initialization Data
  async getNftInit(nftId: bigint): Promise<any> {
    await this.isDeployed();

    const params = new TupleBuilder();
    params.writeNumber(nftId);

    const stack = await this.callGetMethod("getNftInit", params);
    // Process the stack to extract the data
    // Implement according to your contract's return structure
    return stack;
  }
}
