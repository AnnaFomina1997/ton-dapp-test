// Jetton.ts
import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
} from 'ton-core';

export type JettonConfig = {};

export function jettonConfigToCell(config: JettonConfig): Cell {
    return beginCell().storeUint(0, 64).endCell();
}

export class Jetton implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {}

    static createFromAddress(address: Address): Jetton {
        return new Jetton(address);
    }

    static createFromConfig(config: JettonConfig, code: Cell, workchain = 0): Jetton {
        const data = jettonConfigToCell(config);
        const init = { code, data };
        return new Jetton(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void> {
        try {
            await provider.internal(via, {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().endCell(),
            });
        } catch (error) {
            console.error('Failed to deploy the contract:', error);
            throw error;
        }
    }

    async getTotalSupply(provider: ContractProvider): Promise<bigint> {
        try {
            const { stack } = await provider.get('get_total_supply', []); // ensure 'get_total_supply' is correct
            return stack.readBigNumber();
        } catch (error) {
            console.error('Failed to get total supply:', error);
            throw error;
        }
    }
}
