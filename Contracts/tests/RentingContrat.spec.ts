import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { RentingContract } from '../wrappers/RentingContrat';
import '@ton/test-utils';
import { CustomersArray } from '../build/RentingContrat/tact_CustomersArray';
import { ProductNft, Nft } from '../wrappers/ProductNft';
import { sleep } from '@ton/blueprint';

describe('RentingContrat', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let rentingContrat: SandboxContract<RentingContract>;
    let productNft: SandboxContract<ProductNft>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');


        /////// Deploy nftProduct
        productNft = blockchain.openContract(await ProductNft.fromInit(deployer.address));

        const deployResult1 = await productNft.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        ///////
        
        rentingContrat = blockchain.openContract(await RentingContract.fromInit(productNft.address));

        const deployResult2 = await rentingContrat.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult2.transactions).toHaveTransaction({
            from: deployer.address,
            to: rentingContrat.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and rentingContrat are ready to use
    });

    it('should increase counter', async () => {

        // const increaser = await blockchain.treasury('increaser');
        const agreements_before = await rentingContrat.getAgreements();

        // console.log('agreements before: ', agreements_before);
        const test_owner_wallet = await blockchain.treasury('test_owner');
        console.log(await test_owner_wallet.getBalance());
        const test_customer_wallet = await blockchain.treasury('test_customer');
        const test_customer_wallet2 = await blockchain.treasury('test_customer2');

        const result = await rentingContrat.send(
            test_owner_wallet.getSender(),
            {
                value: 1000000000n,
            },
            {
                $$type: "Agreement",
                owner: test_owner_wallet.getSender().address,
                customer: test_customer_wallet.getSender().address,
                token: toNano(1),
                agreement_duration: BigInt(4),
                price_per_hour: BigInt(5),
                stake: toNano(6),
            }
        );
        
        const result2 = await rentingContrat.send(
            test_owner_wallet.getSender(),
            {
                value: 1000000000n,
            },
            {
                $$type: "Agreement",
                owner: test_owner_wallet.getSender().address,
                customer: test_customer_wallet2.getSender().address,
                token: BigInt(5),
                agreement_duration: BigInt(4),
                price_per_hour: BigInt(5),
                stake: BigInt(6),
            }
        );


        printTransactionFees(result.transactions);

        const customersAddr = await rentingContrat.getCustomersContractAddr(test_owner_wallet.getSender().address);

        let customersContract = blockchain.openContract(await CustomersArray.fromAddress(customersAddr!));

        let res = await customersContract.getCustomersAgreement();

        console.log("Customers contracts : ", res["_map"]);

        // Test NFT collection exists, then create a NFT
        let nftCollectionAddress = await customersContract.getNftCollectionAddress();
        let nftCollection = blockchain.openContract(await ProductNft.fromAddress(nftCollectionAddress));
        console.log("NFT current Id : ", await nftCollection.getNftId());
        let ret = await nftCollection.send(
            test_owner_wallet.getSender(),
            {
                value: toNano("1000"),
            },
            {
                $$type: "InitNft",
                owner: test_owner_wallet.address,
                productName: "Test product",
                productDescription: "Test description",
                productStake: toNano(1000),
                descriptionImageUrl: "https://wwwgoogle.com",
                productLocation: "London",
                productHourPrice: toNano(1)

            }
        );        
        
        console.log("NFT current Id : ", await nftCollection.getNftId());
        expect(await nftCollection.getNftId()).toBe(BigInt(1));

        // TODO : Retrieve the nft id in returned infos
        const nftId = await nftCollection.getNftId();
        const nft = blockchain.openContract(Nft.fromAddress(await nftCollection.getGetNftAddress(nftId)));




        //////////////////// Test staking ////////////////////////////////
        console.log("Nft summary before : ", await nft.getSummary());
        //let resultatt = await rentingContrat.send(
        //    test_customer_wallet.getSender(),
        //    {
        //        value: toNano("1"),
        //    },
        //    "TEST"
        //);
        //console.log("Nft summary after : ", await nft.getSummary());
        //return;

        let stake = toNano("1");
        let duration = BigInt(2);
        let pricePerHour = toNano("10");

        await productNft.send(
            test_owner_wallet.getSender(),
            {
                value: stake,
            },
            {
                $$type: "ChangeOwner",
                newOwner: customersContract.address,
                nftId: BigInt(1),
                originalSender: null
            }
        );

        // Customer Send stake
        let resultat = await customersContract.send(
            test_customer_wallet.getSender(),
            {
                value: stake,
            },
            null
        );

        //printTransactionFees(resultat.transactions);


        await sleep(4);

        console.log("Nft summary should have changed : ", await nft.getSummary());


        // Owner send owner request
        rentingContrat.send(
            test_owner_wallet.getSender(),
            {
                value: toNano("0.1")
            },
            {
                $$type: "OwnerRequest",
                owner: test_owner_wallet.address,
                customer: test_customer_wallet.address,
                fulfilled: true,
            }
        )        

        // Customer send renting fees
        customersContract.send(
            test_customer_wallet.getSender(),
            {
                value: duration*pricePerHour,
            },
            null
        );

        await sleep(1);

        console.log("Nft summary should have changed again : ", await nft.getSummary());
    });
});
