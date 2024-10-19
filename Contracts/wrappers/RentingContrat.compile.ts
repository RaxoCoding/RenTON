import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/renting_contrat.tact',
    options: {
        debug: true,
    },
};
