import { Blockchain, printTransactionFees, SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { ProductNft, Nft } from '../wrappers/ProductNft';
import '@ton/test-utils';
import { randomInt } from 'crypto';

describe('ProductNft', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let productNft: SandboxContract<ProductNft>;

    function display_log(res: SendMessageResult) {
        for(let ext of res.externals) {
            //console.log("Externals : ", res.externals);
            const firstMsgBody = ext.body;
            const firstMsgText = firstMsgBody.asSlice().loadStringTail();
            console.log("# ", firstMsgText);
        }
    }

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        productNft = blockchain.openContract(await ProductNft.fromInit(deployer.address));

        const deployResult = await productNft.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: productNft.address,
            deploy: true,
            success: true,
        });
    });

    it('test token creation', async () => {
        
        let nftId = await productNft.getNftId();
        console.log(nftId);

        for(let i = 0; i < 10; i ++) {
            const res = await productNft.send(
                deployer.getSender(),
                {
                    value: toNano('1000')
                },
                {
                    $$type: "InitNft",
                    owner: deployer.address,
                    customer: deployer.address,
                    productStake: BigInt(randomInt(100)),
                    productName: "Test product "+i,
                    productDescription: "Test description "+i,
                    descriptionImageUrl: "https://iheartcraftythings.com/wp-content/uploads/2021/06/9.jpg"
                }
            )
            printTransactionFees(res.transactions);   
        }
        

        //display_log(res);
        
        
        // console.log(res.transactions[0].outMessages['n:0']);

        nftId = await productNft.getNftId();
        console.log(nftId);
        const nft_addrs = await productNft.getGetNftAddresses();
        console.log(nft_addrs);
        for(let [nft_id, nft_addr] of nft_addrs) {
            console.log("Nft address : ", nft_addr);
            const nft = blockchain.openContract(Nft.fromAddress(nft_addr));
            console.log("Test get : ", await nft.getSummary());
        }
        //const nft_res = await nft.send(
        //    deployer.getSender(),
        //    {
        //        value: toNano('1000')
        //    },
        //    {
        //        $$type: 'InitNft',
        //        owner: deployer.address,
        //        productValue: BigInt(10),
        //        productName: "Test product",
        //        productDescription: "Test description"
        //    }
        //)
//
        //expect(nft_res.transactions).toHaveTransaction({
        //    from: deployer.address,
        //    to: productNft.address,
        //    deploy: true,
        //    success: true,
        //});

        
        

        
        

        //console.log("Token creation res : ", res);
        //const nft_addresses = await productNft.getGetNftAddresses();
        //
        //console.log("Nft addresses : ", nft_addresses);
        //for(let [_id, addr] of nft_addresses) {
        //    const nft = blockchain.openContract(Nft.fromAddress(addr));
        //    console.log(`Nft ${_id} summary : `, await nft.getSummary());
        //}

        //const nft_address = await productNft.getGetNftAddress();
        //const nft = blockchain.openContract(Nft.fromAddress(nft_address));
        
        
    });
});
