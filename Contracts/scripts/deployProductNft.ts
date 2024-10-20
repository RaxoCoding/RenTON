import { toNano } from '@ton/core';
import { ProductNft } from '../wrappers/ProductNft';
import { NetworkProvider } from '@ton/blueprint';
import { Address } from '@ton/core';
import { randomInt } from 'crypto';

export async function run(provider: NetworkProvider) {
    const test_pub_address = Address.parse("0QBADHKEmV-7Bexo5XOcSD0hPDVpd5h1_kA15DMjpzLU92Wl");
    const productNft = provider.open(await ProductNft.fromInit(test_pub_address));

    await productNft.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: "InitNft",
            owner: test_pub_address,
            productValue: toNano("1000"),
            productLocation: "Berlin",
            productName: "Test product ",
            productDescription: "Test description ",
            descriptionImageUrl: "https://iheartcraftythings.com/wp-content/uploads/2021/06/9.jpg"
        }
    );

    await provider.waitForDeploy(productNft.address);

    //console.log('ID', await productNft.getId());
}
