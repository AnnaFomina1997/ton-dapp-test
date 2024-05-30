// src/components/WalletInfo.tsx
import React from 'react';
import { CONFIG } from '../config';

interface WalletInfoProps {
    address: string | undefined;
    balance: number | undefined;
    tokenBalance: number;
    accountBalance: number;
    isLoading: boolean;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ address, balance, tokenBalance, accountBalance, isLoading }) => {
    return (
        <div className="Card">
            <b>Wallet Address:</b>
            <div className="Hint">{address?.slice(0, 90)}</div>
            {/* <b>Balance:</b>
            <div className="Hint">{balance} TON</div> */}
            {isLoading ? (
                <p>Loading token balance...</p>
            ) : (
                <>
                    <b>Wallet tokens:</b>
                    <div className="Hint">{tokenBalance} {CONFIG.tokenSymbol}</div>
                    <b>Account tokens:</b>
                    <div>{accountBalance} {CONFIG.tokenSymbol}</div>
                </>
            )}
        </div>
    );
};

export default WalletInfo;
