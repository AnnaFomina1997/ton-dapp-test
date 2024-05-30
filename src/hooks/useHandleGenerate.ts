// src/hooks/useHandleGenerate.ts
import axios from 'axios';
import { CONFIG } from '../config';

export const useHandleGenerate = (
    deductToken: (params: { accountId: any, amount: any }) => void,
    setAccountBalance: (balance: number) => void
) => {
    const handleGenerate = async (prompt: string, address: string | undefined, setGeneratedImage: (url: string) => void, setError: (message: string) => void) => {
        try {
            const response = await axios.post(`${CONFIG.baseUrl}/generate`, { prompt, username: address }, {
                headers: { 'Content-Type': 'application/json' },
                responseType: 'blob',
            });

            if (response.status === 200) {
                const blob = response.data;
                const url = URL.createObjectURL(blob);
                setGeneratedImage(url);
                await deductToken({ accountId: address, amount: 1 });
            } else {
                throw new Error('Image generation failed');
            }
        } catch (error) {
            console.error('Error during image generation or token deduction:', error);
            // @ts-ignore
            if (error.response?.data.error === 'Insufficient tokens') {
                setError('Insufficient tokens to generate an image.');
            }
            // @ts-ignore
            if (error.response?.data.error === 'User not found') {
                setError('User not found. Please create an account.');
            }
        }
    };

    return { handleGenerate };
};
