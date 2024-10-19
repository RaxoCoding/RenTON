import { toNano } from '@ton/core';
import { RentingContract } from '../wrappers/RentingContrat';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const rentingContrat = provider.open(await RentingContract.fromInit());

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
