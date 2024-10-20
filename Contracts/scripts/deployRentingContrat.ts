import { Address, toNano } from '@ton/core';
import { RentingContract } from '../wrappers/RentingContrat';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const productNftAddress = Address.parse(args.length > 0 ? args[0] : await ui.input('ProductNft address'));
    const rentingContrat = provider.open(await RentingContract.fromInit(productNftAddress));

    await rentingContrat.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(rentingContrat.address);

    console.log('Agreements', await rentingContrat.getAgreements());
}
