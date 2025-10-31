"use client";

import { useState } from "react";
import { X, Trash2, Loader2, Plus } from "lucide-react";
import { SavingTransaction } from "@/type/SavingTransaction";

interface SavingTransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    savingName: string;
    savingId: string;
    transactions: SavingTransaction[];
    onDelete: (idDetail: string) => Promise<void>;
    onAddNew: () => void;
    loading: boolean;
}

export default function SavingTransactionHistoryModal({
    isOpen,
    onClose,
    savingName,
    transactions,
    onDelete,
    onAddNew,
    loading
}: SavingTransactionHistoryModalProps) {
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    console.log(transactions);

    const handleDelete = async (idDetail: string) => {
        setDeleting(true);
        try {
            await onDelete(idDetail);
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert("Có lỗi xảy ra khi xóa");
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl border border-[var(--color-border)]/20 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]/10">
                    <div>
                        <h2 className="text-xl font-semibold">Lịch sử tiết kiệm</h2>
                        <p className="text-sm text-[var(--color-text)] mt-1">{savingName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-foreground rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <>
                            {/* Transaction List */}
                            <div className="space-y-3">
                                {transactions
                                    .sort((a, b) => {
                                        // Handle datetime with microseconds for sorting
                                        const parseDateStr = (dateStr: string) => {
                                            if (!dateStr) return 0;
                                            let normalized = dateStr;
                                            if (normalized.includes('.') && /\.\d{4,}/.test(normalized)) {
                                                normalized = normalized.replace(/(\.\d{3})\d+/, '$1');
                                            }
                                            if (!normalized.endsWith('Z') && !normalized.includes('+')) {
                                                normalized += 'Z';
                                            }
                                            return new Date(normalized).getTime();
                                        };
                                        
                                        const dateA = parseDateStr(a.createdAt);
                                        const dateB = parseDateStr(b.createdAt);
                                        return dateB - dateA;
                                    })
                                    .map((transaction) => (
                                        <div
                                            key={transaction.idDetail}
                                            className="group flex items-center justify-between p-4 rounded-lg bg-foreground 
                               border border-[var(--color-border)]/10 hover:border-amber-500/30 transition-all"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-semibold text-lg">
                                                            {transaction.amount.toLocaleString()}
                                                        </p>
                                                        <p className="text-sm text-[var(--color-text)]">
                                                            {(() => {
                                                                // Handle datetime with microseconds: 2025-10-29T13:49:46.077487
                                                                if (!transaction.createdAt) return 'N/A';
                                                                
                                                                // Replace microseconds (more than 3 decimal digits) with milliseconds
                                                                // 2025-10-29T13:49:46.077487 -> 2025-10-29T13:49:46.077Z
                                                                let dateStr = transaction.createdAt;
                                                                
                                                                // If it has a decimal point with more than 3 digits, truncate to 3
                                                                if (dateStr.match(/\.\d{4,}/)) {
                                                                    dateStr = dateStr.replace(/(\.\d{3})\d+/, '$1');
                                                                }
                                                                
                                                                // Add Z if not already present
                                                                if (!dateStr.endsWith('Z')) {
                                                                    dateStr += 'Z';
                                                                }
                                                                
                                                                const date = new Date(dateStr);
                                                                
                                                                if (isNaN(date.getTime())) {
                                                                    return transaction.createdAt;
                                                                }
                                                                
                                                                return date.toLocaleString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                });
                                                            })()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {deleteConfirm === transaction.idDetail ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-red-500 mr-2">Xác nhận?</span>
                                                    <button
                                                        onClick={() => handleDelete(transaction.idDetail)}
                                                        disabled={deleting}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg 
                                     hover:bg-red-600 disabled:opacity-50 transition-all"
                                                    >
                                                        {deleting ? "..." : "Xóa"}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        disabled={deleting}
                                                        className="px-3 py-1.5 bg-foreground border border-[var(--color-border)]/20 
                                     text-sm rounded-lg hover:brightness-110 transition-all"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(transaction.idDetail)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 
                                   rounded-lg transition-all"
                                                    title="Xóa giao dịch"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <Plus className="w-8 h-8 text-amber-500" />
                            </div>
                            <p className="text-[var(--color-text)] mb-4">Chưa có giao dịch nào</p>
                            <button
                                onClick={onAddNew}
                                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
                            >
                                Thêm giao dịch đầu tiên
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {transactions.length > 0 && (
                    <div className="p-6 border-t border-[var(--color-border)]/10">
                        <button
                            onClick={onAddNew}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white 
                       rounded-lg hover:bg-amber-600 active:scale-95 transition-all font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm tiền tiết kiệm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
