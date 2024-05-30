// src/hooks/useFetchAccountBalance.ts
import { useState } from 'react';
import axios from 'axios';
import { CONFIG } from '../config';

export const useFetchAccountBalance = () => {
    const [accountBalance, setAccountBalance] = useState(0);

    const fetchAccountBalance = async (accountId: string) => {
        try {
            const response = await axios.post(`${CONFIG.baseUrl}/get_account_balance`, { user_id: accountId });
            const data = response.data;
            if (data.success) {
                setAccountBalance(data.account_balance);
            } else {
                console.error('Failed to fetch account balance:', data.message, accountId);
            }
        } catch (error) {
            console.error('Error fetching account balance:', error, accountId);
        }
    };

    return { accountBalance, fetchAccountBalance, setAccountBalance };
};
