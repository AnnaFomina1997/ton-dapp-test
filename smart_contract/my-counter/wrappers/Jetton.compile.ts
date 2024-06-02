import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'func',
    targets: ['contracts/jetton-wallet.fc',
        'contracts/imports/stdlib.fc',
        'contracts/imports/params.fc',
        'contracts/imports/constants.fc',
        'contracts/imports/jetton-utils.fc',
        'contracts/imports/op-codes.fc',
        'contracts/imports/utils.fc']
};
