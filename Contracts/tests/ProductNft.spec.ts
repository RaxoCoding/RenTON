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
    it("", async () => {})

    it('test token creation', async () => {
        
        let nftId = await productNft.getNftId();
        console.log(nftId);

        for(let i = 0; i < 1; i ++) {
            const res = await productNft.send(
                deployer.getSender(),
                {
                    value: toNano('1000')
                },
                {
                    $$type: "InitNft",
                    owner: deployer.address,
                    productName: "Test product "+i,
                    productDescription: "Test description "+i,
                    descriptionImageUrl: "https://iheartcraftythings.com/wp-content/uploads/2021/06/9.jpg",
                    productStake: toNano(1000),
                    productLocation: "Toulouse",
                    productHourPrice: toNano(1)
                }
            )
            //printTransactionFees(res.transactions);   
        }
        

        //display_log(res);
        
        nftId = await productNft.getNftId();
        console.log(nftId);
        const nft_addrs = await productNft.getGetNftAddresses();
        console.log(nft_addrs);
        for(let [nft_id, nft_addr] of nft_addrs) {
            console.log("Nft address : ", nft_addr);
            const nft = blockchain.openContract(Nft.fromAddress(nft_addr));
            console.log("Test get : ", await nft.getSummary());
        }
    });
});
