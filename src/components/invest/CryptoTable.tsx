'use client'

import useCrypto from '@/services/useCrypto';
import { Crypto } from '@/type/Crypto';
import React, { useEffect, useState } from 'react'


const CryptoTable = () => {
    const { getCryptoList } = useCrypto();
    const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCryptoList();
            setCryptoData(data?.data);
        };
        fetchData();
    }, []);

    const filteredCryptoData = cryptoData?.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 2,
        }).format(num);
    };

   

    return (
        <div className='w-full h-full flex flex-col'>
            {/* Header Section */}
            <div className="flex-shrink-0 rounded-t-lg bg-background p-4 border border-b-0 border-text/10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-text">Top 100 cryptocurrencies</p>
                    </div>
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Search by name or symbol..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-11 bg-foreground text-text rounded-lg border border-text/20 
                                     focus:outline-none focus:ring-2 focus:ring-text/30 focus:border-transparent
                                     placeholder:text-text/50 transition-all shadow-md"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text opacity-50 hover:opacity-100 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 bg-background rounded-lg rounded-t-none shadow-2xl overflow-hidden border border-t-0 border-text/10 flex flex-col">
                <div className="overflow-x-auto overflow-y-auto nice-scroll flex-1">
                    <table className="w-full table-fixed">
                        <colgroup><col className="w-16" /><col className="w-48" /><col className="w-32" /><col className="w-24" /><col className="w-32" /><col className="w-32" /><col className="w-40" /></colgroup>
                        <thead className="border-b border-text/10 sticky bg-background top-0 z-10">
                            <tr>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">#</th>
                                <th className="px-4 py-4 text-left text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">Coin</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">Price</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">24h %</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">Market Cap</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">Volume</th>
                                <th className="px-4 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider whitespace-nowrap">Circ. Supply</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-text/5">
                            {filteredCryptoData?.map((crypto) => (
                                <tr
                                    key={crypto.id}
                                    className="hover:bg-text/5 transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm  text-text font-medium">
                                        {crypto.market_cap_rank}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <img
                                                src={crypto.image}
                                                alt={crypto.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-text">{crypto.name}</div>
                                                <div className="text-xs text-text opacity-60 uppercase">{crypto.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-text">
                                        {formatPrice(crypto.current_price)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-bold">
                                        <span className={crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                            {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-text font-medium">
                                        {formatNumber(crypto.market_cap)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-text">
                                        {formatNumber(crypto.total_volume)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-text">
                                        <div>{formatNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}</div>
                                        {crypto.max_supply && (
                                            <div className="text-xs text-text opacity-50">
                                                Max: {formatNumber(crypto.max_supply)}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CryptoTable