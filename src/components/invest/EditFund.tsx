'use client'

import React, { useState, useEffect } from 'react'

interface EditFundModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: EditFundData) => void;
    fundData?: {
        idFund: string;
        fundName: string;
        description: string;
    };
    loading?: boolean;
}

interface EditFundData {
    fundName: string;
    description: string;
}

const EditFund = ({ isOpen, onClose, onSubmit, fundData, loading }: EditFundModalProps) => {
    const [formData, setFormData] = useState<EditFundData>({
        fundName: '',
        description: '',
    });

    useEffect(() => {
        if (fundData) {
            setFormData({
                fundName: fundData.fundName,
                description: fundData.description,
            });
        }
    }, [fundData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(formData);
        setFormData({ fundName: '', description: '' });
    };

    const handleClose = () => {
        setFormData({ fundName: '', description: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-sm bg-foreground rounded-3xl shadow-2xl p-8 relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-text/60 hover:text-text transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-text mb-8 text-center">Chỉnh sửa quỹ</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fund Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text">
                            Tên quỹ
                        </label>
                        <div className="relative">
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
                        <div className="relative">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả quỹ"
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
                                 cursor-pointer border border-text/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditFund;
