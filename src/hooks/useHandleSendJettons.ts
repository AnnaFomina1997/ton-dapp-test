// src/hooks/useHandleSendJettons.ts
import { beginCell, toNano } from '@ton/ton';
import axios from 'axios';
import { Address } from '@ton/core';
import { CONFIG } from '../config';

export const useHandleSendJettons = (
    tonConnectUI: any,
    jettonWalletContract: string,
    setAccountBalance: (balance: number) => void,
    setError: (message: string) => void
) => {
    const handleSendJettons = async (address: string | undefined, depAmount: string, connected: boolean) => {
        if (!address || !connected) {
            console.error('Wallet not connected or address missing');
            setError('Wallet not connected or address missing');
            return;
        }

        const Wallet_DST = Address.parse(CONFIG.recipientAddress);
        const Wallet_SRC = Address.parse(address);
        const forwardPayload = beginCell()
            .storeUint(0, 32)
            .storeStringTail('Deposit: ' + parseInt(depAmount))
            .endCell();

        const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(parseInt(depAmount) * 1000000000)
            .storeAddress(Wallet_DST)
            .storeAddress(Wallet_SRC)
            .storeBit(0)
            .storeCoins(toNano('0.02'))
            .storeBit(1)
            .storeRef(forwardPayload)
            .endCell();

        const myTransaction = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: jettonWalletContract,
                    amount: toNano('0.5').toString(),
                    payload: body.toBoc().toString('base64')
                }
            ]
        };

        try {
            await tonConnectUI.sendTransaction(myTransaction);
            console.log('Jetton transfer transaction sent');

            const startDate = Math.floor(Date.now() / 1000) - 600; // 10 минут назад
            const endDate = startDate + 7200; // 2 часа вперед

            const response = await axios.post(`${CONFIG.baseUrl}/update_balance_after_transaction`, {
                user_id: address,
                token_id: CONFIG.tokenId,
                start_date: startDate,
                end_date: endDate
            });

            if (response.data.success) {
                setAccountBalance(response.data.new_balance);
            } else {
                setError('Failed to fetch new transaction.');
            }

        } catch (error) {
            console.error('Error sending jetton transfer transaction:', error);
            setError('Error sending jetton transfer transaction.');
        }
    };

    return { handleSendJettons };
};
