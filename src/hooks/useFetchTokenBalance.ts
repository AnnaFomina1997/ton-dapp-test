// src/hooks/useFetchTokenBalance.ts
import { useState } from 'react';
import axios from 'axios';
import { CONFIG } from '../config';

export const useFetchTokenBalance = () => {
    const [tokenBalance, setTokenBalance] = useState(0);

    const fetchTokenBalance = async (accountId: string, tokenSymbol: string) => {
        try {
            const response = await axios.post(`${CONFIG.baseUrl}/get_token_balance`, {
                account_id: accountId,
                token_symbol: tokenSymbol,
            });
            const data = response.data;
            if (response.status === 200) {
                setTokenBalance(data.token_balance / (10 ** 9));
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error(`Error fetching ${tokenSymbol} balance:`, error);
        }
    };

    return { tokenBalance, fetchTokenBalance };
};
