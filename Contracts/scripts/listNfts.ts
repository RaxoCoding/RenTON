import { Address, toNano } from '@ton/core';
import { ProductNft, Nft } from '../wrappers/ProductNft';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('ProductNft address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const productNft = provider.open(ProductNft.fromAddress(address));

    for(let [_id, addr] of await productNft.getGetNftAddresses()) {
        const nft = provider.open(Nft.fromAddress(addr));
        console.log(addr, " => " , await nft.getSummary());
    };
}
