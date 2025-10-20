'use client'

import useFund from '@/services/useFund';
import React, { useState } from 'react'

interface CreateFundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: CreateFundData) => Promise<void>;
    loading?: boolean;
}

interface CreateFundData {
    fundName: string;
    fundDescription: string;
}

const CreateFund = ({ isOpen, onClose, onSubmit, loading }: CreateFundModalProps) => {

    const [formData, setFormData] = useState<CreateFundData>({
        fundName: '',
        fundDescription: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit?.(formData);
        setFormData({ fundName: '', fundDescription: '' });
    };

    const handleClose = () => {
        setFormData({ fundName: '', fundDescription: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-sm bg-foreground rounded-3xl shadow-2xl p-8 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute cursor-pointer top-6 right-6 text-text/60 hover:text-text transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-text mb-8 text-center">Thêm quỹ đầu tư</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fund Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text">
                            Tên quỹ
                        </label>
                        <div className="relative mt-2">
                            <input
                                type="text"
                                name="fundName"
                                value={formData.fundName}
                                onChange={handleChange}
                                placeholder="..."
                                className="w-full px-4 py-3 bg-background text-text rounded-lg border border-text/10
                                         focus:outline-none focus:ring-2 focus:ring-text/30 focus:border-transparent
                                         placeholder:text-text/40 transition-all"
                            />
                        </div>
                    </div>

                    {/* Fund Description Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text">
                            Mô tả
                        </label>
                        <div className="relative mt-2">
                            <textarea
                                name="fundDescription"
                                value={formData.fundDescription}
                                onChange={handleChange}
                                placeholder="Mô tả"
                                rows={3}
                                className="w-full px-4 py-3 bg-background text-text rounded-lg border border-text/10
                                         focus:outline-none focus:ring-2 focus:ring-text/30 focus:border-transparent
                                         placeholder:text-text/40 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 px-6 py-3 bg-background text-text font-semibold rounded-full
                                 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg
                                 cursor-pointer border border-text/10"
                    >
                        {loading ? 'Đang tạo...' : 'Tạo quỹ'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFund;
