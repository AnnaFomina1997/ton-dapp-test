// src/App.tsx
import React, { useEffect, useState } from 'react';
import './App.css';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { Address } from '@ton/core';
import WalletInfo from './components/WalletInfo';
import ImageGenerator from './components/ImageGenerator';
import ErrorPopup from './components/ErrorPopup';
import { useFetchAccountBalance } from './hooks/useFetchAccountBalance';
import { useFetchTokenBalance } from './hooks/useFetchTokenBalance';
import { useHandleGenerate } from './hooks/useHandleGenerate';
import { useHandleSendJettons } from './hooks/useHandleSendJettons';
import { CONFIG } from './config';

const App: React.FC = () => {
    const [tonConnectUI] = useTonConnectUI();
    const { connected, wallet } = useTonConnect();

    const [prompt, setPrompt] = useState('');
    const [depAmount, setDepAmount] = useState('10');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [address, setAddress] = useState<string | undefined>(undefined);
    const [balance, setBalance] = useState<number | undefined>(undefined);

    const [addressGetted, setAddressGetted] = useState(false);
    const [balanceGetted, setBalanceGetted] = useState(false);

    const { accountBalance, fetchAccountBalance, setAccountBalance } = useFetchAccountBalance();
    const { tokenBalance, fetchTokenBalance } = useFetchTokenBalance();

    const { handleSendJettons } = useHandleSendJettons(tonConnectUI, CONFIG.jettonWalletContract, setAccountBalance, setError);

    const tokenSymbol = CONFIG.tokenSymbol;
    const jettonWalletContract = CONFIG.jettonWalletContract;

    const handleUpdateUserDetails = async () => {
        if (address && balance !== undefined && !isLoading) {
            setIsLoading(true);
            try {
                const response = await fetch(`${CONFIG.baseUrl}/update_user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: address, ton_balance: balance })
                });
                const data = await response.json();
                console.log(data.message);
            } catch (error) {
                console.error('Error updating user:', error);
                setError('Error updating user details.');
            }
            setIsLoading(false);
        }
    };

    const deductToken = async ({ accountId, amount }: { accountId: any, amount: any }) => {
        try {
            const response = await fetch(`${CONFIG.baseUrl}/deduct_token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: accountId, deduction_amount: amount })
            });
            const data = await response.json();
            if (data.success) {
                console.log('Token deducted:', data.new_balance, wallet);
                setAccountBalance(data.new_balance);
            } else {
                console.error('Failed to deduct token:', data.message);
                setError('Failed to deduct token.');
            }
        } catch (error) {
            console.error('Error deducting token:', error);
            setError('Error deducting token.');
        }
    };
    const { handleGenerate } = useHandleGenerate(deductToken, setAccountBalance);
    useEffect(() => {
        if (address && balance !== undefined) {
            handleUpdateUserDetails();
        }
        if (address) {
            fetchTokenBalance(address, tokenSymbol);
            fetchAccountBalance(address);
        }
    }, [address, balance]);

    useEffect(() => {
        const fetchWalletDetails = async () => {
            if (!connected) {
                setAddress(undefined);
                setBalance(undefined);
                setAddressGetted(false);
                setBalanceGetted(false);
                return;
            }

            try {
                const addr = wallet.account?.address;
                console.log('Fetching wallet details...');

                if (!addressGetted) {
                    console.log('Fetching address...');
                    const validAddress = Address.parseRaw(addr).toString();
                    setAddress(validAddress);
                    setAddressGetted(true);
                }

                if (!balanceGetted) {
                    console.log('Fetching balance...');
                    const walletBalance = await getWalletBalance(addr);
                    setBalance(walletBalance);
                    setBalanceGetted(true);
                }
            } catch (error) {
                console.error('Error fetching wallet info:', error);
                setError('Error fetching wallet info.');
                setAddress(undefined);
                setBalance(undefined);
                setAddressGetted(false);
                setBalanceGetted(false);
            }

        };

        fetchWalletDetails();
    }, [connected]);

    return (
        <div className="App">
            <div className="Container">
                <TonConnectButton />
                {/* Jetton Deposit */}
                <div className="ImageGenerator">
                    <input
                        type="text"
                        value={depAmount}
                        onChange={e => setDepAmount(e.target.value)}
                        placeholder="Enter deposit amount"
                    />
                    <button className={`Button ${connected ? 'Active' : 'Disabled'}`} onClick={() => handleSendJettons(address, depAmount, connected)}>
                        Deposit Jettons
                    </button>
                </div>
                {/* Wallet Information */}
                {connected && (
                    <WalletInfo
                        address={address}
                        balance={balance}
                        tokenBalance={tokenBalance}
                        accountBalance={accountBalance}
                        isLoading={isLoading}
                    />
                )}

                {/* Contract Information */}
                <div className="Card">
                    <b>Contract Address</b>
                    <div className="Hint">{jettonWalletContract}</div>
                </div>

                {/* Image Generation */}
                <ImageGenerator
                    prompt={prompt}
                    setPrompt={setPrompt}
                    handleGenerate={() => handleGenerate(prompt, address, setGeneratedImage, setError)}
                    generatedImage={generatedImage}
                />

                {/* Error Popup */}
                {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
            </div>
        </div>
    );
};

export default App;

async function getWalletBalance(address: string | undefined): Promise<number | undefined> {
    if (!address) return undefined;

    try {
        const response = await fetch(`${CONFIG.baseUrl}/get_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address })
        });
        const jsonResult = await response.json();

        console.log('Balance response:', jsonResult);
        if (jsonResult.ok) {
            return jsonResult.result / (10 ** 9);  // Convert to TON units
        } else {
            console.warn('Failed to retrieve balance.');
            return undefined;
        }
    } catch (e) {
        console.error('Error fetching balance:', e);
        return undefined;
    }
}
