'use client'

import React, { useEffect, useState } from 'react'
import CreateFund from './CreateFund'
import EditFund from './EditFund'
import { useUserContext } from '@/context';
import useFund from '@/services/useFund';
import { FundItem } from '@/type/FundItem';
import { useRouter } from 'next/navigation';

const Fund = () => {
    const router = useRouter();
    const userContext = useUserContext();
    const { createFund, getListFunds, fundLoading, updateFund, deleteFund } = useFund();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFund, setSelectedFund] = useState<FundItem | null>(null);
    const [funds, setFunds] = useState<FundItem[]>([]);
    console.log(funds);
    
    useEffect(() => {
        const fetchFunds = async () => {
            try {
                const data = await getListFunds(userContext?.user?.idUser || '');
                setFunds(data?.data || []);
            } catch (error) {
                console.error('Error fetching funds:', error);
            }
        };

        fetchFunds();
    }, []);

    const handleCreateFund = async (data: { fundName: string; fundDescription: string }) => {
        const newFund = {
            fundName: data.fundName,
            description: data.fundDescription,
            idUser: userContext?.user?.idUser || ''
        }
        await createFund(newFund);
        const refreshData = await getListFunds(userContext?.user?.idUser || '');
        setFunds(refreshData?.data || []);
        setIsCreateModalOpen(false);
    };

    const handleEditFund = (fund: FundItem) => {
        setSelectedFund(fund);
        setIsEditModalOpen(true);
    };

    const handleUpdateFund = async (data: { fundName: string; description: string }) => {
        const updatedFund = {
            fundName: data.fundName,
            description: data.description
        }
        await updateFund(selectedFund?.idFund || '', updatedFund);
        const refreshData = await getListFunds(userContext?.user?.idUser || '');
        setFunds(refreshData?.data || []);
        setIsEditModalOpen(false);
    };

    const handleDeleteFund = async (idFund: string, fundName: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa quỹ "${fundName}"?`)) {
            await deleteFund(idFund);
            const refreshData = await getListFunds(userContext?.user?.idUser || '');
            setFunds(refreshData?.data || []);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-background p-4 rounded-lg">
            {/* Header */}
            <div className="mb-4 flex-shrink-0 flex items-center justify-between ">
                <div className="text-2xl font-bold text-text">Mục tiêu đầu tư</div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 bg-background text-text font-semibold rounded-full
                   border border-text/20 hover:brightness-110 active:scale-[0.98]
                   transition-all shadow-lg cursor-pointer text-sm"
                >
                    Thêm quỹ đầu tư
                </button>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {funds.map((fund) => (
                    <div
                        key={fund.idFund}
                        className="rounded-2xl p-4 shadow-xl border border-text/10 hover:shadow-2xl transition-all flex-shrink-0 relative"
                    >
                        {/* Delete Button */}
                        <button
                            onClick={() => handleDeleteFund(fund.idFund, fund.fundName)}
                            className="absolute cursor-pointer top-4 right-4 p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                            title="Xóa quỹ"
                        >
                            <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>

                        {/* Fund Header */}
                        <div className="mb-4 pr-8">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text text-sm font-bold">
                                    {fund.fundName.charAt(0)}
                                </div>
                                <h3 className="text-lg font-semibold text-text">{fund.fundName}</h3>
                            </div>
                        </div>

                        {/* Date and Description */}
                        <div className="mb-6 p-4 bg-background rounded-lg">
                            <span className="text-xs text-text/60 line-clamp-2 truncate">Ngày tạo: {new Date(fund.createAt).toLocaleDateString()}</span>
                            <span className="text-xs text-text/60 line-clamp-2 truncate">Mô tả: {fund.description}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleEditFund(fund)}
                                className="flex-1 px-4 py-2.5 bg-background text-text font-semibold rounded-lg
                         hover:brightness-110 active:scale-[0.98] transition-all border border-text/20
                         flex items-center justify-center gap-2 text-sm cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={() => router.push(`/dashboard/portfolio/${fund.idFund}`)}
                                className="flex-1 px-4 py-2.5 bg-background text-text font-semibold rounded-lg
                         hover:brightness-110 active:scale-[0.98] transition-all border border-text/20
                         flex items-center justify-center gap-2 text-sm cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Fund Modal */}
            <CreateFund
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateFund}
                loading={fundLoading}
            />

            {/* Edit Fund Modal */}
            <EditFund
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleUpdateFund}
                fundData={selectedFund ? {
                    idFund: selectedFund.idFund,
                    fundName: selectedFund.fundName,
                    description: selectedFund.description
                } : undefined}
                loading={fundLoading}
            />
        </div>
    )
}

export default Fund