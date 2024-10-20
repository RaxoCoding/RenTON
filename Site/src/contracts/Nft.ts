import {
  Address,
  Cell,
  Builder,
  Sender,
  toNano,
  TupleBuilder,
	TonClient,
	TupleReader
} from "ton"; // Ensure you have the 'ton-core' package installed
import { tonClient } from "./connection";

// Define the types used in the contract
type InitNft = {
  $$type: "InitNft";
  owner: Address;
  productName: string;
  productDescription: string;
  descriptionImageUrl: string;
  productValue: bigint;
};

type UpdateProductProperties = {
  $$type: "UpdateProductProperties";
  productName: string | null;
  productDescription: string | null;
  descriptionImageUrl: string | null;
  productValue: bigint | null;
};

type ChangeOwner = {
  $$type: "ChangeOwner";
  newOwner: Address;
};

type Deploy = {
  $$type: "Deploy";
  queryId: bigint;
};

type NftSummary = {
  $$type: "NftSummary";
  owner: Address;
  productName: string;
  productDescription: string;
  productValue: bigint;
  descriptionImageUrl: string;
	productLocation: string;
};

// The main Nft class
export class Nft {
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
    builder.storeUint(3939375188, 32); // op code for InitNft
    builder.storeAddress(message.owner);
    builder.storeStringRefTail(message.productName);
    builder.storeStringRefTail(message.productDescription);
    builder.storeStringRefTail(message.descriptionImageUrl);
    builder.storeInt(message.productValue, 257);
    return builder.endCell();
  }

  // Helper function to serialize UpdateProductProperties messages
  private storeUpdateProductProperties(
    message: UpdateProductProperties
  ): Cell {
    const builder = new Builder();
    builder.storeUint(4200171903, 32); // op code for UpdateProductProperties

    if (message.productName !== null && message.productName !== undefined) {
      builder.storeBit(true).storeStringRefTail(message.productName);
    } else {
      builder.storeBit(false);
    }

    if (
      message.productDescription !== null &&
      message.productDescription !== undefined
    ) {
      builder.storeBit(true).storeStringRefTail(message.productDescription);
    } else {
      builder.storeBit(false);
    }

    if (
      message.descriptionImageUrl !== null &&
      message.descriptionImageUrl !== undefined
    ) {
      builder.storeBit(true).storeStringRefTail(message.descriptionImageUrl);
    } else {
      builder.storeBit(false);
    }

    if (
      message.productValue !== null &&
      message.productValue !== undefined
    ) {
      builder.storeBit(true).storeInt(message.productValue, 257);
    } else {
      builder.storeBit(false);
    }

    return builder.endCell();
  }

  // Helper function to serialize ChangeOwner messages
  private storeChangeOwner(message: ChangeOwner): Cell {
    const builder = new Builder();
    builder.storeUint(256331011, 32); // op code for ChangeOwner
    builder.storeAddress(message.newOwner);
    return builder.endCell();
  }

  // Helper function to serialize Deploy messages
  private storeDeploy(message: Deploy): Cell {
    const builder = new Builder();
    builder.storeUint(2490013878, 32); // op code for Deploy
    builder.storeUint(message.queryId, 64);
    return builder.endCell();
  }

  // The send function adjusted to include helper functions
  async send(
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message: InitNft | UpdateProductProperties | ChangeOwner | Deploy
  ) {
    let body: Cell | null = null;

    if (message.$$type === "InitNft") {
      body = this.storeInitNft(message);
    } else if (message.$$type === "UpdateProductProperties") {
      body = this.storeUpdateProductProperties(message);
    } else if (message.$$type === "ChangeOwner") {
      body = this.storeChangeOwner(message);
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

  // Method to initialize the NFT
  async initNft(
    via: Sender,
    owner: Address,
    productName: string,
    productDescription: string,
    descriptionImageUrl: string,
    productValue: bigint,
    amount: bigint = toNano("0.05") // Default amount to send
  ) {
    // Create the InitNft message
    const message: InitNft = {
      $$type: "InitNft",
      owner,
      productName,
      productDescription,
      descriptionImageUrl,
      productValue,
    };

    // Send the message to the contract
    await this.send(
      via,
      { value: amount, bounce: false },
      message
    );
  }

  // Method to update product properties
  async updateProductProperties(
    via: Sender,
    productName: string | null,
    productDescription: string | null,
    descriptionImageUrl: string | null,
    productValue: bigint | null,
    amount: bigint = toNano("0.02") // Default amount to send
  ) {
    // Create the UpdateProductProperties message
    const message: UpdateProductProperties = {
      $$type: "UpdateProductProperties",
      productName,
      productDescription,
      descriptionImageUrl,
      productValue,
    };

    // Send the message to the contract
    await this.send(
      via,
      { value: amount, bounce: false },
      message
    );
  }

  // Method to change owner
  async changeOwner(
    via: Sender,
    newOwner: Address,
    amount: bigint = toNano("0.02") // Default amount to send
  ) {
    // Create the ChangeOwner message
    const message: ChangeOwner = {
      $$type: "ChangeOwner",
      newOwner,
    };

    // Send the message to the contract
    await this.send(
      via,
      { value: amount, bounce: false },
      message
    );
  }

  // Method to get NFT summary
  async getSummary(): Promise<NftSummary> {
    await this.isDeployed();

    const result = await this.client.runMethod(this.address, "summary");
		
    const stack = result.stack;

		const summary = this.parseNftSummary(stack);

		return summary;
  }

  // Helper function to parse NftSummary from the stack
  private parseNftSummary(stack: any): NftSummary {
    const reader = new TupleReader(stack.items);

    const owner = reader.readAddress();

		const productName = reader.readString();

    const productDescription = reader.readString();

    const productValue = reader.readBigNumber();

    const descriptionImageUrl = reader.readString();

    const productLocation = reader.readString();

    return {
      $$type: "NftSummary",
      owner,
      productName,
      productDescription,
      productValue,
      descriptionImageUrl,
			productLocation
    };
  }

  // Add other methods as needed, including helper functions

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
}
