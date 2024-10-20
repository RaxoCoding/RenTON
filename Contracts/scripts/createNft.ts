import { Address, toNano } from '@ton/core';
import { ProductNft } from '../wrappers/ProductNft';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const test_pub_address = Address.parse("0QBADHKEmV-7Bexo5XOcSD0hPDVpd5h1_kA15DMjpzLU92Wl");
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('ProductNft address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const productNft = provider.open(ProductNft.fromAddress(address));

    const nftMapBefore = await productNft.getGetNftAddresses();

    await productNft.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'InitNft',
            owner: test_pub_address,
            productStake: toNano(10),
            productDescription: "Test description",
            productName: "Test product",
            productLocation: "Berlin",
            descriptionImageUrl: "https://www.google.com",
            productHourPrice: toNano(1)
            
        }
    );

    ui.write('Waiting for addresses to change...');

    const nftMapAfter = await productNft.getGetNftAddresses();
    let attempt = 1;
    while (nftMapBefore["_map"].length === nftMapAfter["_map"].length) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        const nftMapAfter = await productNft.getGetNftAddresses();
        attempt++;
    }

    console.log("Map before :", nftMapBefore["_map"]);
    console.log("Map after :", nftMapAfter["_map"]);
    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
