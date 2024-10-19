import "@stdlib/deploy";

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

const minNftValue: Int = ton("0.1");

contract ProductNft with Deployable {
    productOwner: Address;
    curNftId: Int = 0;

    init(_productOwner: Address) {
        self.productOwner = _productOwner;
    }
    
    receive(msg: InitNft) {
        self.mint(msg);
    }

    fun mint(msg: InitNft) {
        dump("Check before minting");
        let ctx: Context = context();
        //require(ctx.value <= minNftValue, "Insufficient initial NFT value");
        //require(ctx.sender == self.productOwner, "Only owner can deploy NFT");
        self.curNftId = self.curNftId + 1;
        let init: StateInit = self.getNftInit(self.curNftId);
        dump("Start minting");
        send(SendParameters{
            to: self.getNftAddress(self.curNftId),
            body: msg.toCell(),
            mode: SendRemainingValue,
            value: ton("0"),
            code: init.code,
            data    : init.data
        });
        dump("Minting done");
    }

    get fun getNftAddress(_nftId: Int): Address {
        return contractAddress(self.getNftInit(_nftId));
    }

    get fun getNftInit(_nftId: Int): StateInit {
        return initOf Nft(myAddress(), _nftId);
    }

    get fun getNftAddresses(): map<Int,Address> {
        let i: Int = 0;
        let ret: map<Int,Address> = emptyMap();
        while(i < self.curNftId) {
            i = i + 1;
            ret.set(i, self.getNftAddress(i));
        }
        return ret;

    }

    get fun getTestInternal(_nftId: Int) {
        self.getNftAddress(_nftId)

    }

    get fun nftId(): Int {
        return self.curNftId;
    }
}

message InitNft {
    owner: Address;
    customer: Address;
    productStake: Int as coins;
    productName: String;
    productDescription: String;
    descriptionImageUrl: String;
}

struct NftSummary {
    owner: Address;
    customer: Address;
    productStake: Int as coins;
    productStakeFilled: Bool;
    productName: String;
    productDescription: String;
    descriptionImageUrl: String;
}

message ReceiveFees {
    customer: Address
}

contract Nft with Deployable {
    parent_contract: Address;
    initDone: Bool = false;
    summary: NftSummary?;
    owner: Address?;
    customer: Address?;
    productStake: Int?;
    productName: String?;
    productDescription: String?;
    descriptionImageUrl: String?;
    productStakeFilled: Bool = false;

    init(_parent_contract: Address, _value: Int) {
        dump("NFT creation");
        self.parent_contract = _parent_contract;
    }

    receive(msg: InitNft) {
        dump("NFT init start");
        let ctx = context();
        require(self.parent_contract == ctx.sender, "Only parent can init NFT");
        require(self.initDone == false, "Init already done");
        self.owner =  msg.owner;
        self.customer =  msg.customer;
        self.productStake =  msg.productStake;
        self.productName =  msg.productName;
        self.productDescription =  msg.productDescription;
        self.descriptionImageUrl =  msg.descriptionImageUrl;
        self.productStakeFilled = false;
        self.initDone = true;
    }

    get fun summary(): NftSummary {
        require(self.initDone == true, "Not initialized");
        return NftSummary{
            owner: self.owner!!,
            customer: self.customer!!,
            productStake: self.productStake!!,
            productStakeFilled: self.productStakeFilled,
            productName: self.productName!!,
            productDescription: self.productDescription!!,
            descriptionImageUrl: self.descriptionImageUrl!!
        };
    }

    receive(msg: ReceiveFees) {
        let ctx = context();
        require(self.initDone == true, "Initialisation not done");
        require(ctx.sender == self.parent_contract, "Only parent can send fees");
        require(ctx.value == self.productStake, "Given stake value must be equal to product stake");
        self.customer = msg.customer;
        self.productStakeFilled = true;
        dump("Received fees");
    }

    receive("DeliverFees") {
        let ctx = context();
        require(ctx.sender == self.parent_contract, "Only parent can send deliver fees");
        dump("Delivering NFT value");
        send(SendParameters{
            to: self.parent_contract,
            value: ton("0"),
            mode: SendRemainingBalance | SendRemainingValue,
            body: self.summary().toCell()
        });
        self.customer = null;

    }


    
}