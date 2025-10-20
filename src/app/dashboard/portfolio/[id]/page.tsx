'use client'

import useFund from '@/services/useFund';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react';
import AddCrypto from '@/components/invest/AddCrypto';
import AddTransaction from '@/components/invest/AddTransaction';
import CryptoDetail from '@/components/invest/CryptoDetail';

interface FundDetail {
    totalFinanceCurrent: number;
    totalTransactionAmount: number;
    totalProfitAndLoss: number;
    averageFinanceAssets: {
        assetName: string;
        averageFinance: number;
        percentageInPortfolio: number;
    }[] | null;
    listInvestmentAssetResponse: {
        idAsset: string;
        id: string;
        assetName: string;
        assetSymbol: string;
        currentPrice: number;
        marketCap: number;
        totalVolume: number;
        priceChangePercentage24h: number;
        url: string;
    }[] | null;
}

const DetailFund = () => {
    const id = useParams().id;
    const router = useRouter();
    const { getDetailFund, addCrypto, deleteCrypto, addTransaction } = useFund();
    const [fundDetail, setFundDetail] = useState<FundDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAddCryptoModalOpen, setIsAddCryptoModalOpen] = useState(false);
    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
    const [isCryptoDetailModalOpen, setIsCryptoDetailModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<{
        id: string;
        name: string;
        symbol: string;
        price: number;
    } | null>(null);

    useEffect(() => {
        const fetchDetailFund = async () => {
            try {
                setLoading(true);
                const data = await getDetailFund(String(id));
                setFundDetail(data?.data);
            } catch (error) {
                console.error('Error fetching detail fund:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailFund();
    }, [id]);
    
    const handleAddCrypto = async (data: { id: string; assetName: string; assetSymbol: string; idFund: string }) => {
        await addCrypto(data);
        setIsAddCryptoModalOpen(false);
        const refreshData = await getDetailFund(String(id));
        setFundDetail(refreshData?.data);
    };

    const handleDeleteCrypto = async (idAsset: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa tiền ảo này khỏi quỹ?')) {
            await deleteCrypto(idAsset);
            const refreshData = await getDetailFund(String(id));
            setFundDetail(refreshData?.data);
        }
    };

    const handleOpenAddTransaction = (asset: { id: string; name: string; symbol: string; price: number }) => {
        setSelectedAsset(asset);
        setIsAddTransactionModalOpen(true);
    };

    const handleOpenCryptoDetail = (asset: { id: string; name: string; symbol: string; price: number }) => {
        setSelectedAsset(asset);
        setIsCryptoDetailModalOpen(true);
    };

    const handleAddTransaction = async (data: { type: string; price: number; quantity: number; fee: number; expense: number; idAsset: string }) => {
        await addTransaction(data);
        setIsAddTransactionModalOpen(false);
        setSelectedAsset(null);
        const refreshData = await getDetailFund(String(id));
        setFundDetail(refreshData?.data);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 2,
        }).format(num);
    };

    const getChangeColor = (value: number) => {
        if (value > 0) return 'text-green-500';
        if (value < 0) return 'text-red-500';
        return 'text-text';
    };

    const colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-text" size={48} />
            </div>
        );
    }

    if (!fundDetail) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-text">Không tìm thấy quỹ</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className='flex gap-2'>
                    <button
                        onClick={() => router.back()}
                        className="p-2 cursor-pointer hover:bg-background rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-text">My portfolio</h1>
                </div>
                <button
                    onClick={() => setIsAddCryptoModalOpen(true)}
                    className="px-6 py-2.5 bg-foreground text-text font-semibold rounded-full 
                             border border-text/20 hover:brightness-110 active:scale-[0.98] 
                             transition-all shadow-lg cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm crypto
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Pie Chart Section */}
                <div className="lg:col-span-1 bg-background rounded-2xl p-6 shadow-xl border border-text/10">
                    <h2 className="text-lg font-semibold text-text mb-4">Tổng tài sản</h2>

                    {fundDetail.averageFinanceAssets && fundDetail.averageFinanceAssets.length > 0 ? (
                        <>
                            {/* Pie Chart */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative w-48 h-48">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                        {fundDetail.averageFinanceAssets.map((asset, index) => {
                                            const previousPercentage = fundDetail.averageFinanceAssets!
                                                .slice(0, index)
                                                .reduce((sum, a) => sum + a.percentageInPortfolio, 0);
                                            const radius = 40;
                                            const circumference = 2 * Math.PI * radius;
                                            const offset = circumference - (asset.percentageInPortfolio / 100) * circumference;
                                            const rotation = (previousPercentage / 100) * 360;

                                            return (
                                                <circle
                                                    key={asset.assetName}
                                                    cx="50"
                                                    cy="50"
                                                    r={radius}
                                                    fill="transparent"
                                                    stroke={colors[index % colors.length]}
                                                    strokeWidth="20"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={offset}
                                                    style={{
                                                        transform: `rotate(${rotation}deg)`,
                                                        transformOrigin: '50% 50%',
                                                    }}
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-2">
                                {fundDetail.averageFinanceAssets.map((asset, index) => (
                                    <div key={asset.assetName} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: colors[index % colors.length] }}
                                            />
                                            <span className="text-sm text-text">{asset.assetName}</span>
                                        </div>
                                        <span className="text-sm font-medium text-text">{asset.percentageInPortfolio}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <svg className="w-20 h-20 text-text/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-text/60 text-center text-sm">
                                Chưa có tài sản nào trong quỹ
                            </p>
                            <p className="text-text/40 text-center text-xs mt-2">
                                Thêm tiền ảo để bắt đầu
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Current Finance - Tổng tiền quỹ hiện tại */}
                    <div className="bg-background rounded-2xl p-6 shadow-xl border border-text/10">
                        <p className="text-sm text-text/60 mb-2">Tổng tiền quỹ hiện tại</p>
                        <p className="text-2xl font-bold text-text">{Number(fundDetail.totalFinanceCurrent).toLocaleString("vi-VN")}</p>
                    </div>

                    {/* Total Transaction Amount - Số tiền vốn bỏ ra */}
                    <div className="bg-background rounded-2xl p-6 shadow-xl border border-text/10">
                        <p className="text-sm text-text/60 mb-2">Số tiền vốn bỏ ra</p>
                        <p className="text-2xl font-bold text-text">{Number(fundDetail.totalTransactionAmount).toLocaleString("vi-VN")}</p>
                    </div>

                    {/* Profit/Loss - Lãi/Lỗ */}
                    <div className="bg-background rounded-2xl p-6 shadow-xl border border-text/10">
                        <p className="text-sm text-text/60 mb-2">
                            {fundDetail.totalProfitAndLoss >= 0 ? 'Lãi' : 'Lỗ'}
                        </p>
                        <p className={`text-2xl font-bold ${getChangeColor(fundDetail.totalProfitAndLoss)}`}>
                            {fundDetail.totalProfitAndLoss >= 0 ? '+' : ''}{Number(fundDetail.totalProfitAndLoss).toLocaleString("vi-VN")}
                        </p>
                    </div>

                    {/* Empty placeholder or additional info */}
                    <div className="bg-background rounded-2xl p-6 shadow-xl border border-text/10">
                        <p className="text-sm text-text/60 mb-4">Tổng quan</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-text/70">ROI:</span>
                                <span className={`font-semibold ${getChangeColor(fundDetail.totalProfitAndLoss)}`}>
                                    {fundDetail.totalTransactionAmount > 0
                                        ? ((fundDetail.totalProfitAndLoss / fundDetail.totalTransactionAmount) * 100).toFixed(2)
                                        : '0.00'
                                    }%
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text/70">Số tài sản:</span>
                                <span className="font-semibold text-text">
                                    {fundDetail.listInvestmentAssetResponse?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-background rounded-2xl shadow-xl border border-text/10 overflow-hidden">
                <div className="p-6 border-b border-text/10">
                    <h2 className="text-xl font-bold text-text">Tiền ảo</h2>
                </div>
                {fundDetail.listInvestmentAssetResponse && fundDetail.listInvestmentAssetResponse.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-background border-b border-text/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text uppercase tracking-wider">Tiền ảo</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider">Giá</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider">24g</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider">7ng</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text uppercase tracking-wider">Vốn hóa thị trường</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-text uppercase tracking-wider">7 ngày qua</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-text uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-text/5">
                                {fundDetail.listInvestmentAssetResponse.map((asset) => (
                                    <tr key={asset.idAsset} className="hover:bg-text/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div 
                                                className="flex items-center gap-3 cursor-pointer group"
                                                onClick={() => handleOpenCryptoDetail({
                                                    id: asset.idAsset,
                                                    name: asset.assetName,
                                                    symbol: asset.assetSymbol,
                                                    price: asset.currentPrice
                                                })}
                                            >
                                                <img
                                                    src={asset.url}
                                                    alt={asset.assetName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div>
                                                    <div className="font-semibold text-text group-hover:text-blue-500 transition-colors">
                                                        {asset.assetName}
                                                    </div>
                                                    <div className="text-xs text-text/60 uppercase">{asset.assetSymbol}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-text whitespace-nowrap">
                                            {Number(asset.currentPrice).toLocaleString("vi-VN")}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${getChangeColor(asset.priceChangePercentage24h)}`}>
                                            {asset.priceChangePercentage24h >= 0 ? '+' : ''}{asset.priceChangePercentage24h.toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 text-right text-text whitespace-nowrap">
                                            {formatNumber(asset.totalVolume)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-text whitespace-nowrap">
                                            {formatNumber(asset.marketCap)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <svg width="80" height="30" className="text-red-500">
                                                    <polyline
                                                        points="0,15 20,10 40,20 60,5 80,25"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => handleOpenAddTransaction({
                                                        id: asset.idAsset,
                                                        name: asset.assetName,
                                                        symbol: asset.assetSymbol,
                                                        price: asset.currentPrice
                                                    })}
                                                    className="p-2 cursor-pointer hover:bg-green-500/10 rounded-lg transition-colors group"
                                                    title="Thêm giao dịch"
                                                >
                                                    <svg className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCrypto(asset.idAsset)}
                                                    className="p-2 cursor-pointer hover:bg-red-500/10 rounded-lg transition-colors group"
                                                    title="Xóa khỏi quỹ"
                                                >
                                                    <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <svg className="w-24 h-24 text-text/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-text/60 text-center text-lg font-semibold mb-2">
                            Chưa có tài sản nào
                        </p>
                        <p className="text-text/40 text-center text-sm">
                            Bắt đầu đầu tư bằng cách thêm tiền ảo vào quỹ của bạn
                        </p>
                    </div>
                )}
            </div>

            {/* Add Crypto Modal */}
            <AddCrypto
                isOpen={isAddCryptoModalOpen}
                onClose={() => setIsAddCryptoModalOpen(false)}
                onSubmit={handleAddCrypto}
                loading={loading}
                fundId={String(id)}
            />

            {/* Add Transaction Modal */}
            {selectedAsset && (
                <AddTransaction
                    isOpen={isAddTransactionModalOpen}
                    onClose={() => {
                        setIsAddTransactionModalOpen(false);
                        setSelectedAsset(null);
                    }}
                    onSubmit={handleAddTransaction}
                    loading={loading}
                    assetId={selectedAsset.id}
                    assetName={selectedAsset.name}
                    assetSymbol={selectedAsset.symbol}
                    currentPrice={selectedAsset.price}
                />
            )}

            {/* Crypto Detail Modal */}
            {selectedAsset && (
                <CryptoDetail
                    isOpen={isCryptoDetailModalOpen}
                    onClose={() => {
                        setIsCryptoDetailModalOpen(false);
                        setSelectedAsset(null);
                    }}
                    idAsset={selectedAsset.id}
                    assetName={selectedAsset.name}
                    assetSymbol={selectedAsset.symbol}
                />
            )}
        </div>
    )
}

export default DetailFund