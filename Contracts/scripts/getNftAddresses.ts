import { Address, toNano } from '@ton/core';
import { ProductNft } from '../wrappers/ProductNft';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('ProductNft address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const productNft = provider.open(ProductNft.fromAddress(address));

    console.log(await productNft.getGetNftAddresses());
}
