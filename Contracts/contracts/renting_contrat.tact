import "@stdlib/deploy";

message Agreement {
    owner: Address;
    customer: Address;
    token: Int;
    agreement_duration: Int as uint128;
    price_per_hour: Int as uint128;
    stake: Int as uint128;
}

message ChildResponse {
    token_received: Int;
}

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

struct AgreementInfos {
    owner: Address;
    customer: Address;
    token: Int;                         // TODO: change Int to NFT
    timestart: Int as uint128;          // in seconds starting from 1st january 1970 at 0h00 UTC+0   (using Now() function)
    agreement_duration: Int as uint128; // timestart + agreement_duration = time to give stake to Owner
    price_per_hour: Int as uint128;     // TODO: Use appropriate token unit
    stake: Int as uint128;              // TODO: We need to search how to use payable contract to keep it here and redistribute as needed
}

contract RentingContract with Deployable {
    agreements: map<Address, Address>;

    init(){
        self.agreements = emptyMap();
    }

    receive(msg: Agreement) {
        let agreement = AgreementInfos{
            owner: msg.owner,
            customer: msg.customer,
            token: msg.token,
            timestart: now(),
            agreement_duration: msg.agreement_duration,
            price_per_hour: msg.price_per_hour,
            stake: msg.stake
        };
        let add_agreement_msg = AddCustomer{
            agreement_infos: agreement,
        };
        if (self.agreements.get(agreement.owner) == null){
            let init: StateInit = initOf CustomersArray(myAddress());
            let addr: Address = contractAddress(init);
            send(SendParameters{
                to: addr,
                body: add_agreement_msg.toCell(),
                value: ton("0"),                // pay for message and potential deployment
                mode: SendRemainingValue,
                code: init.code,                // if child is not deployed, also deploy it
                data: init.data
            });
            self.agreements.set(agreement.owner, addr);
        }
        else {
            let addr: Address = self.agreements.get(agreement.owner)!!;
            send(SendParameters{
                to: addr,
                body: add_agreement_msg.toCell(),
                value: ton("0"),              // pay for message and potential deployment
                mode: SendRemainingValue
            });
        }

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Agreement added.".asComment());
    }

    receive(request: OwnerRequest){
        require(sender() == request.owner, "Not authorized (only owner can do OwnerRequest)");
        require(self.agreements.get(request.owner) != null, "Owner doesn't already exist");
        
        let customers_contract_addr = self.agreements.get(request.owner)!!;
        let agreement_ending = AgreementEndValidation{
            owner: request.owner,
            customer: request.customer,
            fulfilled: request.fulfilled,
            timeend: now(),
        };

        send(SendParameters{
                to: customers_contract_addr,
                body: agreement_ending.toCell(),
                value: ton("0"),              
                mode: SendRemainingValue
            }
        );

        self.notify("Agreement validation done.".asComment());
    }

    receive(msg: ChildResponse){
        dump(msg.token_received);
    }

    get fun agreements(): map<Address, Address> {
        return self.agreements;
    }

    get fun customersContractAddr(owner: Address): Address? {
        return self.agreements.get(owner);
    }
}

struct Array {
    customers: map<Int as uint16, AgreementInfos>; // array of Int values as a map of Ints to Ints,
                                // with serialization of its keys to uint16 to save space
    last_idx_free: Int = 0;            
}

// Compile-time constant upper bound for our map representing an array. (enough until now, could be higher)
const MaxArraySize: Int = 5_000; // 5,000 entries max, to stay reasonably far from limits


// Extension mutation function for adding new entries to the end of the array
extends mutates fun append(self: Array, item: AgreementInfos) {
    require(self.last_idx_free + 1 <= MaxArraySize, "No space in the array left for new items!");

    self.customers.set(self.last_idx_free, item); // set the entry (key-value pair)
    self.last_idx_free += 1;                // increase the length field
}


// Extension function for getting the value at the given index
extends fun getIdx(self: Array, idx: Int): AgreementInfos {
    require(self.last_idx_free > 0, "No items in the array!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.last_idx_free, "Index is out of array bounds!");

    return self.customers.get(idx)!!;
}

// Extension function for returning the last value
extends fun getLast(self: Array): AgreementInfos {
    require(self.last_idx_free > 0, "No items in the array!");
    return self.customers.get(self.last_idx_free - 1)!!;
}

// Extension mutation function for deleting and entry at the given index and returning its value
extends mutates fun deleteIdx(self: Array, idx: Int): AgreementInfos {
    require(self.last_idx_free > 0, "No items in the array to delete!");
    require(idx >= 0, "Index of the item cannot be negative!");
    require(idx < self.last_idx_free, "Index is out of array bounds!");

    // Remember the value, which is going to be deleted
    let memorized: AgreementInfos = self.customers.get(idx)!!;

    self.customers.set(idx, null); // delete the entry (maybe for the futur to reuse it, or some checking to know if the Agreement is closed)

    return memorized;
}

// Extension function for deleting all items in the Array
extends mutates fun deleteAll(self: Array) {
    self.customers = emptyMap();
    self.last_idx_free = 0;
}

// Global static function for creating an empty Array
fun emptyArray(): Array {
    return Array{customers: emptyMap(), last_idx_free: 0};
}


// Contract, with emulating an Array of customers
contract CustomersArray {
    customers_list: Array;
    customer_id: map<Address, Int>;
    parent: Address;

    init(parent: Address) {
        self.customers_list = emptyArray();
        self.parent = parent;
    }

    // Add a new customer
    // TODO: we doesn't check if he exist here. We need to for the futur, to avoid to erase an actual AgreementInfos
    receive(toAppend: AddCustomer) {
        require(sender() == self.parent, "Not authorized");
        require(self.customer_id.get(toAppend.agreement_infos.customer) == null, "This customer is already using something for this owner");
        self.customer_id.set(toAppend.agreement_infos.customer, self.customers_list.last_idx_free);
        self.customers_list.append(toAppend.agreement_infos);
    }

    receive(toDelete: DeleteCustomer){
        require(sender() == self.parent, "Not authorized");
        require(self.customer_id.get(toDelete.customer) != null, "Customer can't be deleted from this array [Unknown customer]");
        let customer_idx = self.customer_id.get(toDelete.customer)!!;
        self.customer_id.set(toDelete.customer, null);
        self.reply(self.customers_list.deleteIdx(customer_idx).toCell());
    }

    // Remove the 1st item if it exists and reply back with its value, or raise an error
    receive("delete_test") {
        require(sender() == self.parent, "Not authorized");
        self.reply(self.customers_list.deleteIdx(0).toCell());
    }

    // Reply back with the latest item in the array if it exists, or raise an error
    receive("get_last") {
        require(sender() == self.parent, "Not authorized");    
        self.reply(self.customers_list.getLast().toCell());
    }

    // Internal message receiver, which responds to a String message "delete_all"
    receive("delete_all") {
        require(sender() == self.parent, "Not authorized");
        self.customers_list.deleteAll();
    }

    receive(msg: Agreement){
        self.reply(ChildResponse{token_received: msg.token}.toCell());
    }

    receive(request: AgreementEndValidation){
        require(sender() == self.parent, "Not authorized");
        let customer_idx = self.customer_id.get(request.customer);
        require(customer_idx != null, "Customer doesn't exist for this owner");
        let _agreement = self.customers_list.customers.get(customer_idx!!);
        require(_agreement != null, "Agreement is null for this customer");
        // Check if the agreement time for the stake is respected and if the owner hasn't lied
        let agreement: AgreementInfos = _agreement!!;
        require( (agreement.timestart + agreement.agreement_duration < request.timeend) == request.fulfilled, "AgreementEndValidation doesn't correspond to the given fulfilled stake time");

        // If we're here, then we need to process; 
        // TODO: do the following lines with the NFT and TON tokens
        // If fulfilled, then resend the NFT to owner and the stake to customer
        // otherwise, send the stake to the owner

        if(request.fulfilled){
            
        }
        // Here we don't delete the customer, so he can't buy to this owner anymore (because in add there is a check to ensure the null for the mapping customer_id) 
        else {

        }
    }

    get fun customers_agreement() : map<Int as uint16, AgreementInfos> {
        dump(self.customers_list.last_idx_free);
        return self.customers_list.customers;
    }
}