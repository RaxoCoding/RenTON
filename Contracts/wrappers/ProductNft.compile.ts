import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/product_nft.tact',
    options: {
        debug: true,
        external: true
    },
};
