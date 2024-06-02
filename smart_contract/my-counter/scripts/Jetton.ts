// run.ts
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { Jetton } from '../wrappers/Jetton';
import { Address, toNano } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const owner: Address = Address.parse('EQA3t8bLMVefvnSxuEQ0lavt9OeIu9d--lNJ5w8LoNfe73p6');
    const contractAddr: Address = Address.parse("EQDrutOeoPHI0dt0BFR2tmWjqSOGpX8u04KsmijjOzhVYMN9");
    // const jetton = provider.open(
    //     Jetton.createFromConfig({
    //         owner: owner },
    //         await compile('Jetton')));

    // await jetton.sendDeploy(provider.sender(), toNano('0.05'));
    //
    // await provider.waitForDeploy(jetton.address);
    //
    // console.log(address);
    // let jetton;
    // try {
    //     jetton = provider.open(
    //         Jetton.createFromAddress(address) // замените на адрес вашего контракта
    //     );
    // } catch (error) {
    //     console.error('Error opening Jetton:', error);
    // }


    // try {
    //     const totalSupply = await jetton.getTotalSupply();
    //     console.log('Total Supply:', totalSupply.toString());
    // } catch (error) {
    //     console.error('Error fetching total supply:', error);
    // }
}
