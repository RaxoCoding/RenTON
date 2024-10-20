import "@stdlib/deploy";
import "./messages.tact";
import "./product_nft.tact";

contract RentingContract with Deployable {
    agreements: map<Address, Address>;
    nftCollectionAddress: Address;

    init(nftCollectionAddress: Address){
        self.agreements = emptyMap();
        self.nftCollectionAddress = nftCollectionAddress;
    }

    receive(msg: Agreement) {
        let agreement = AgreementInfos{
            owner: msg.owner,
            customer: msg.customer,
            token: msg.token,
            timestart: now(),
            timeend: 0,
            agreement_duration: msg.agreement_duration,
            price_per_hour: msg.price_per_hour,
            stake: msg.stake,
            has_staked: false,
            owner_claimed: false,
        };
        let add_agreement_msg = AddCustomer{
            agreement_infos: agreement,
        };
        if (self.agreements.get(agreement.owner) == null){
            let init: StateInit = initOf CustomersArray(self.nftCollectionAddress, myAddress());
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

    //receive(msg: ChildResponse){
    //    dump(msg.token_received);
    //}

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
    has_paid: map<Address, Bool>;
    nftCollectionAddress: Address;

    init(_nftCollectionAddress: Address, parent: Address) {
        dump("CustomersArray init");
        self.customers_list = emptyArray();
        self.parent = parent;
        self.nftCollectionAddress = _nftCollectionAddress;
    }

    // Add a new customer
    // TODO: we doesn't check if he exist here. We need to for the futur, to avoid to erase an actual AgreementInfos
    receive(toAppend: AddCustomer) {
        require(sender() == self.parent, "Not authorized");
        require(self.customer_id.get(toAppend.agreement_infos.customer) == null, "This customer is already using something for this owner");
        self.customer_id.set(toAppend.agreement_infos.customer, self.customers_list.last_idx_free);
        self.customers_list.append(toAppend.agreement_infos);
    }

    // Receive the staking
    receive(){
        dump("Starting staking");
        let customer_addr = sender();
        let customer_idx = self.customer_id.get(customer_addr);
        require(customer_idx != null, "Customer doesn't exist for this owner");
        let _agreement = self.customers_list.customers.get(customer_idx!!);
        require(_agreement != null, "Agreement is null for this customer");
        // Check if the agreement time for the stake is respected and if the owner hasn't lied
        let agreement: AgreementInfos = _agreement!!;
        dump("Pre validation done");

        require((!agreement.has_staked && !agreement.owner_claimed) || (agreement.has_staked && agreement.owner_claimed), "User can't send tokens between states of staking and owner claim");

        

        // User sending tokens to stake
        if (!agreement.has_staked && !agreement.owner_claimed){
            require(agreement.stake <= context().value, "Not enough money for staking");
            agreement.has_staked = true;
            self.customers_list.customers.set(customer_idx!!, agreement);

            // TODO :
            // Give NFT from owner to customer
            dump("Giving NFT to customer");
            SendParameters{
                to: self.nftCollectionAddress,
                body: ChangeOwner{
                    nftId: agreement.token,
                    newOwner: agreement.customer
                }.toCell(),
                mode: 0,
                value: ton("0.1"),
            };
            
        }
        // User sending tokens to pay 
        else if (agreement.has_staked && agreement.owner_claimed) {
            let time_elipsed = (agreement.timeend - agreement.timestart);
            let time_elipsed_in_hour = time_elipsed / 3600;
            let rest = time_elipsed - (time_elipsed_in_hour*3600); // in second
            let money_needed = time_elipsed_in_hour * agreement.price_per_hour + (rest * agreement.price_per_hour) / 3600 ;
            require(context().value >= money_needed, "Not enough money to pay the rent");
            
            // 
            // Give back NFT from customer to owner
            send(SendParameters{
                to: self.nftCollectionAddress,
                body: ChangeOwner{
                    nftId: agreement.token,
                    newOwner: agreement.owner
                }.toCell(),
                mode: SendRemainingValue,
                value: ton("0"),
            });

            // The user has sent the money, everything is good we can send back NFT and staking, and transfer the payment to the owner
            dump("Sending rent money to owner");
            send(SendParameters{
                    to: agreement.owner,
                    bounce: true,
                    value: money_needed,              
                    mode: 0
                }
            );
            dump("Sending stake back to customer");
            send(SendParameters{
                    to: customer_addr,
                    bounce: true,
                    value: agreement.stake,              
                    mode: 0
                }
            );

            // Delete user so he can re-buy a rent
            send(SendParameters{
                to: myAddress(),
                body: DeleteCustomer{
                    customer: customer_addr
                }.toCell(),
                value: ton("0"),              // pay for message and potential deployment
                mode: SendRemainingValue
            });

        }
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

    //receive(msg: Agreement){
    //    self.reply(ChildResponse{token_received: msg.token}.toCell());
    //}

    receive(request: AgreementEndValidation){
        require(sender() == self.parent, "Not authorized");
        let customer_idx = self.customer_id.get(request.customer);
        require(customer_idx != null, "Customer doesn't exist for this owner");
        let _agreement = self.customers_list.customers.get(customer_idx!!);
        require(_agreement != null, "Agreement is null for this customer");
        // Check if the agreement time for the stake is respected and if the owner hasn't lied
        let agreement: AgreementInfos = _agreement!!;
        require( (agreement.timestart + agreement.agreement_duration < request.timeend) == request.fulfilled, "AgreementEndValidation doesn't correspond to the given fulfilled stake time");

        // If we're here, then we just need to change the timeend and the owner_claimed, so the user can perform the payment OR depending whether the time s exceeded, to transfer the stake to owner
        agreement.owner_claimed = true;
        agreement.timeend = request.timeend;
        if(!request.fulfilled){
            send(SendParameters{
                    to: request.owner,
                    bounce: true,
                    value: agreement.stake,              
                    mode: SendRemainingValue + SendIgnoreErrors
                }
            );
            agreement.has_staked = false; // So the user cannot perform the payment later, and the stake isn't anymore in the pool
            // NOTE: The NFT will never returns to the owner and will be frozen in this pool (since the user has not returned it that seems logical)
            // TODO: We can do something if the user returns the product too late (like transferring back to the owner the NFT and asking for fees payment and BONUS for user)
        }
        self.customers_list.customers.set(customer_idx!!, agreement);
    }

    get fun customers_agreement() : map<Int as uint16, AgreementInfos> {
        dump(self.customers_list.last_idx_free);
        return self.customers_list.customers;
    }

    get fun nftCollectionAddress(): Address {
        return self.nftCollectionAddress;
    }
}