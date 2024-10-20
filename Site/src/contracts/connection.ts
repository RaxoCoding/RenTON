import { TonClient } from "@ton/ton";

// Initialize the TonClient instance
const tonClient = new TonClient({
  endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  apiKey: "3522ef9c302f497b20f81f07d384cf77bbe35c0ef84a77f362b598e3214da543",
});

export { tonClient };