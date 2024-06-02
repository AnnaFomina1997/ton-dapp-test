import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    storeMessageRelaxed,
    toNano,
    internal
} from 'ton-core';

export type JettonWalletConfig = {};

export function jettonMinterConfigToCell(config: JettonWalletConfig): Cell {
    const cell = beginCell();
    // Add configuration serialization if needed
    return cell.endCell();
}

export class JettonWallet implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell }
    ) {
    }

    static createFromAddress(address: Address): JettonWallet {
        return new JettonWallet(address);
    }

    static createFromConfig(config: JettonWalletConfig, code: Cell, workchain = 0): JettonWallet {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        return new JettonWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint): Promise<void> {
        try {
            await provider.internal(via, {
                value,
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: beginCell().endCell()
            });
        } catch (error) {
            console.error('Failed to deploy the contract:', error);
            throw error;
        }
    }

    async getJettonData(provider: ContractProvider): Promise<any> {
        try {
            const result = await provider.get('get_jetton_data', []);
            return {
                totalSupply: result.stack.readBigNumber(),
                adminAddress: result.stack.readAddress(),
                content: result.stack.readCell(),
                jettonWalletCode: result.stack.readCell()
            };
        } catch (error) {
            console.error('Failed to get jetton data:', error);
            throw error;
        }
    }

    async getWalletAddress(provider: ContractProvider, userAddress: string): Promise<Address> {
        try {
            const userAddr = Address.parse(userAddress);
            const result = await provider.get('get_wallet_address', [{
                type: 'slice',
                cell: beginCell().storeAddress(userAddr).endCell()
            }]);
            return result.stack.readAddress();
        } catch (error) {
            console.error('Failed to get wallet address:', error);
            throw error;
        }
    }

    async mintTokens(provider: ContractProvider, via: Sender, toAddress: string, jettonWalletCode: Cell, amount: bigint, masterMsg: Cell): Promise<void> {
        try {
            const toAddr = Address.parse(toAddress);
            const messageBody = beginCell()
                .storeUint(0x18, 6)  // Opcode for mint_tokens
                .storeSlice(beginCell().storeAddress(toAddr).endCell().beginParse())  // to_address
                .storeRef(jettonWalletCode)  // jetton_wallet_code
                .storeCoins(amount)  // amount
                .storeRef(masterMsg)  // master_msg
                .endCell();

            await provider.internal(via, {
                value: toNano('0.1'),
                sendMode: SendMode.PAY_GAS_SEPARATELY,
                body: messageBody
            });
        } catch (error) {
            console.error('Failed to mint tokens:', error);
            throw error;
        }
    }
}
