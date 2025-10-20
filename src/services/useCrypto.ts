import React, { useState } from 'react'
import useAuthFetch  from './useAuthFetch';

const useCrypto = () => {
    const [cryptoLoading, setCryptoLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    const getCryptoList = async () => {
        setCryptoLoading(true);
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/crypto/list-crypto`, {
                method: 'GET'
            });
            const data = await response.json();
            setCryptoLoading(false);
            return data;
        } catch (error) {
            setCryptoLoading(false);
            throw new Error('Error fetching crypto data.', { cause: error });
        }

    }

    return { cryptoLoading, getCryptoList };
}

export default useCrypto