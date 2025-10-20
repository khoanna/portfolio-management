'use client';

import CryptoTable from '@/components/invest/CryptoTable'
import Fund from '@/components/invest/Fund'
import useCrypto from '@/services/useCrypto';
import { Loader2 } from 'lucide-react';
import React from 'react'

const Portfolio = () => {
    const { cryptoLoading } = useCrypto();

    if (cryptoLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-text" size={48} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col p-6 gap-6 overflow-hidden">
            {/* Crypto Table Section - 50% */}
            <div className='h-[500px] flex-shrink-0 overflow-hidden'>
                <CryptoTable />
            </div>

            {/* Fund Section - 50% */}
            <div className=''>
                <Fund />
            </div>
        </div>
    )
}

export default Portfolio