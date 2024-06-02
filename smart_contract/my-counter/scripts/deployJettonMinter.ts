import { toNano } from '@ton/core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const jetton = provider.open(JettonMinter.createFromConfig({}, await compile('JettonMinter')));

    await jetton.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(jetton.address);

    // await Jetton.getJettonData();
}
