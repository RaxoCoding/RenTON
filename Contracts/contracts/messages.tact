// From renting_contract.tact
struct AgreementInfos {
    owner: Address;
    customer: Address;
    token: Address;
    timestart: Int as uint128;          // in seconds starting from 1st january 1970 at 0h00 UTC+0   (using Now() function)
    agreement_duration: Int as uint128; // timestart + agreement_duration = time to give stake to Owner
    price_per_hour: Int as uint128;     // TODO: Use appropriate token unit
    stake: Int as uint128;              // TODO: We need to search how to use payable contract to keep it here and redistribute as needed
    has_staked: Bool;
}

message Agreement {
    owner: Address;
    customer: Address;
    token: Address;
    agreement_duration: Int as uint128;
    price_per_hour: Int as uint128;
    stake: Int as uint128;
}

//message ChildResponse {
//    token_received: Int;
//}

message DeleteCustomer {
    customer: Address;
}

message AddCustomer {
    agreement_infos: AgreementInfos;
}

// Message sent by the owner to either say the requirement is fulfilled (and stake is back to the customer) or not fulfilled and the stake go to the owner
message OwnerRequest {
    owner: Address;
    customer: Address;
    fulfilled: Bool;
}

message AgreementEndValidation {
    owner: Address;
    customer: Address;
    fulfilled: Bool;
    timeend: Int as uint128;
}

// From product_nft.tact

struct NftSummary {
    owner: Address;
    customer: Address;
    productStake: Int as coins;
    productStakeFilled: Bool;
    productName: String;
    productDescription: String;
    descriptionImageUrl: String;
}

message InitNft {
    owner: Address;
    customer: Address;
    productStake: Int as coins;
    productName: String;
    productDescription: String;
    descriptionImageUrl: String;
}

message ReceiveFees {
    customer: Address
}