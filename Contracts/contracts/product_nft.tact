import "@stdlib/deploy";
import "./messages.tact";

const minNftValue: Int = ton("0.1");

contract ProductNft with Deployable {
    productOwner: Address;
    curNftId: Int = 0;

    init(_productOwner: Address) {
        self.productOwner = _productOwner;
    }
    
    receive(msg: InitNft) {
        self.mint(msg);
        self.reply("Done creation".asComment());
        //emit(_nftId.asComment());
    }

    fun mint(msg: InitNft): Int {
        dump("Check before minting");
        let ctx: Context = context();
        //require(ctx.value <= minNftValue, "Insufficient initial NFT value");
        //require(ctx.sender == self.productOwner, "Only owner can deploy NFT");
        self.curNftId = self.curNftId + 1;
        let _nftId = self.curNftId;
        let init: StateInit = self.getNftInit(_nftId);
        dump("Start minting");
        send(SendParameters{
            to: self.getNftAddress(_nftId),
            body: msg.toCell(),
            mode: SendRemainingValue,
            value: ton("0"),
            code: init.code,
            data: init.data
        });
        dump("Minting done");

        return _nftId;
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

    get fun nftExists(_nftId: Int): Bool {
        return self.curNftId < _nftId && _nftId > 0;
    }

    receive(msg: CheckNftExists) {
        require(self.nftExists(msg.nftId), "Token does not exists");
    }

    receive(msg: ChangeOwner) {
        let nftAddress: Address = self.getNftAddress(msg.nftId);
        send(SendParameters{
            to: nftAddress,
            body: msg.toCell(),
            mode: SendRemainingValue,
            value: ton("0")
        });
    }
}

contract Nft with Deployable {
    parent_contract: Address;
    initDone: Bool = false;
    summary: NftSummary?;
    owner: Address?;
    productName: String?;
    productDescription: String?;
    descriptionImageUrl: String?;
    productStake: Int?;
    productLocation: String?;
    productHourPrice: Int?;

    init(_parent_contract: Address, _value: Int) {
        dump("NFT creation");
        self.parent_contract = _parent_contract;
    }

    receive(msg: InitNft) {
        dump("NFT init start");
        let ctx = context();
        //require(self.parent_contract == ctx.sender, "Only parent can init NFT");
        require(self.initDone == false, "Init already done");
        self.owner =  msg.owner;
        self.productName =  msg.productName;
        self.productDescription =  msg.productDescription;
        self.descriptionImageUrl =  msg.descriptionImageUrl;
        self.productStake = msg.productStake;
        self.productLocation = msg.productLocation;
        self.productHourPrice = msg.productHourPrice;
        self.initDone = true;
    }

    get fun summary(): NftSummary {
        require(self.initDone == true, "Not initialized");
        return NftSummary{
            owner: self.owner!!,
            productStake: self.productStake!!,
            productName: self.productName!!,
            productDescription: self.productDescription!!,
            descriptionImageUrl: self.descriptionImageUrl!!,
            productHourPrice: self.productHourPrice!!,
            productLocation: self.productLocation!!
        };
    }

    receive(msg: UpdateProductProperties) {
        if(msg.productStake != null) {
            self.productStake = msg.productStake
        }
        if(msg.productName != null) {
            self.productName = msg.productName;
        }
        if(msg.productDescription != null) {
            self.productDescription = msg.productDescription;
        }
        if(msg.descriptionImageUrl != null) {
            self.descriptionImageUrl = msg.descriptionImageUrl;
        }
        if(msg.productLocation != null) {
            self.productLocation = msg.productLocation;
        }
        if(msg.productHourPrice != null) {
            self.productHourPrice = msg.productHourPrice;
        }
    }

    receive(msg: ChangeOwner) {
        require(context().sender == self.owner, "Only parent can end the rent");
        self.owner = msg.newOwner;
    }
}