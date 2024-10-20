import { Blockchain, printTransactionFees, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { RentingContract } from '../wrappers/RentingContrat';
import '@ton/test-utils';
import { CustomersArray } from '../build/RentingContrat/tact_CustomersArray';
import { ProductNft, Nft } from '../wrappers/ProductNft';

describe('RentingContrat', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let rentingContrat: SandboxContract<RentingContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        rentingContrat = blockchain.openContract(await RentingContract.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await rentingContrat.send(
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
                token: BigInt(3),
                agreement_duration: BigInt(4),
                price_per_hour: BigInt(5),
                stake: BigInt(6),
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

        // Test NFT collection exists
        let nftCollectionAddress = await customersContract.getNftCollectionAddress();
        let nftCollection = blockchain.openContract(await ProductNft.fromAddress(nftCollectionAddress));
        console.log("NFT current Id : ", await nftCollection.getNftId());
    });
});
