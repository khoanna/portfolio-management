"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";
import useTransaction from "@/services/useTransaction";
import useSaving from "@/services/useSaving";
import useBudget from "@/services/useBudget";
import { useUserContext } from "@/context";
import { ChartTransaction, Transaction } from "@/type/Transaction";
import { Saving } from "@/type/Saving";
import { Budget } from "@/type/useBudget";
import { TransactionFormData } from "@/type/TransactionForm";
import { BudgetFormData } from "@/type/BudgetForm";
import { SavingFormData } from "@/type/SavingForm";
import AddEditTransactionModal from "@/components/wallet/AddEditTransactionModal";
import AddEditBudgetModal from "@/components/wallet/AddEditBudgetModal";
import AddEditSavingModal from "@/components/wallet/AddEditSavingModal";
import DeleteConfirmModal from "@/components/wallet/DeleteConfirmModal";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FinanceDashboard: React.FC = () => {
  const context = useUserContext();
  const {
    getListTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransaction();

  const {
    getListSaving,
    createSaving,
    deleteSaving
  } = useSaving();

  const {
    getListBudgets,
    createBudget,
    deleteBudget
  } = useBudget();

  // State
  const [loading, setLoading] = useState(true);
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartTransaction[]>([]);
  const [savingList, setSavingList] = useState<Saving[]>([]);
  const [budgetList, setBudgetList] = useState<Budget[]>([]);

  // Modal states
  const [transactionModal, setTransactionModal] = useState({ isOpen: false, mode: "add" as "add" | "edit", data: null as Transaction | null });
  const [budgetModal, setBudgetModal] = useState({ isOpen: false, mode: "add" as "add" | "edit", data: null as Budget | null });
  const [savingModal, setSavingModal] = useState({ isOpen: false, mode: "add" as "add" | "edit", data: null as Saving | null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: "", id: "", name: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [transactionsData, savingsData, budgetsData] = await Promise.all([
        getListTransaction(context?.user?.idUser),
        getListSaving(context?.user?.idUser),
        getListBudgets(context?.user?.idUser)
      ]);

      setTransactionList(transactionsData?.data?.expenseList || []);
      setChartData(transactionsData?.data?.chartList || []);
      setSavingList(savingsData?.data || []);
      setBudgetList(budgetsData?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context?.user?.idUser) {
      fetchAllData();
    }
  }, [context?.user?.idUser]);

  // Transaction handlers
  const handleTransactionSubmit = async (data: TransactionFormData) => {
    if (!context?.user?.idUser) return;

    if (transactionModal.mode === "add") {
      await createTransaction({
        ...data,
        idUser: context.user.idUser
      });
    } else if (transactionModal.data?.idTransaction) {
      await updateTransaction({
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        amount: data.amount,
        transactionCategory: data.transactionCategory,
        transactionDate: data.transactionDate,
        idUser: context.user.idUser
      }, transactionModal.data.idTransaction);
    }
    await fetchAllData();
  };

  // Budget handlers
  const handleBudgetSubmit = async (data: BudgetFormData) => {
    if (!context?.user?.idUser) return;

    await createBudget({
      budgetName: data.budgetName,
      budgetGoal: data.budgetGoal,
      urlImage: data.urlImage || "",
      idUser: context.user.idUser
    });
    await fetchAllData();
  };

  // Saving handlers
  const handleSavingSubmit = async (data: SavingFormData) => {
    if (!context?.user?.idUser) return;

    await createSaving({
      savingName: data.savingName,
      targetAmount: data.targetAmount,
      targetDate: data.targetDate,
      description: data.description || "",
      urlImage: data.urlImage || "",
      idUser: context.user.idUser
    });
    await fetchAllData();
  };

  // Delete handler
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      if (deleteModal.type === "transaction") {
        await deleteTransaction(deleteModal.id);
      } else if (deleteModal.type === "budget") {
        await deleteBudget(deleteModal.id);
      } else if (deleteModal.type === "saving") {
        await deleteSaving(deleteModal.id);
      }
      await fetchAllData();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Có lỗi xảy ra khi xóa");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Chart setup
  const pieOptions = {
    labels: chartData.map(item => item.transactionCategory),
    colors: ["#F59E0B", "#2EC4B6", "#9C27B0", "#EF4444", "#10B981", "#3B82F6"],
    legend: { position: "bottom" as const },
    dataLabels: { enabled: true },
  };

  const pieSeries = chartData.map(item => item.expensePercent);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-text" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="text-lg font-semibold">Thống kê</div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setTransactionModal({ isOpen: true, mode: "add", data: null })}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                       active:scale-95 transition-all font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Thêm giao dịch
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Transaction table */}
          <div className="lg:col-span-6 rounded-xl bg-background shadow-sm border border-[var(--color-border)]/10 p-4 sm:p-5 transition-all hover:shadow-md">
            <h2 className="text-base sm:text-lg font-semibold mb-3">Lịch sử tiêu tiền</h2>
            {transactionList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-[var(--color-text)] border-b border-[var(--color-border)]/10">
                      <th className="text-left pb-2 whitespace-nowrap">Tên giao dịch</th>
                      <th className="text-left pb-2 whitespace-nowrap">Loại</th>
                      <th className="text-left pb-2 whitespace-nowrap">Số tiền</th>
                      <th className="text-left pb-2 whitespace-nowrap">Ngày</th>
                      <th className="text-center pb-2 whitespace-nowrap">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionList.slice(0, 10).map((t) => (
                      <tr
                        key={t.idTransaction}
                        className="border-b border-[var(--color-border)]/5 hover:bg-[var(--foreground)]/50 transition"
                      >
                        <td className="py-2">{t.transactionName}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs ${t.transactionType === "Chi"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-green-500/10 text-green-500"
                            }`}>
                            {t.transactionType}
                          </span>
                        </td>
                        <td className="text-right font-medium whitespace-nowrap">
                          {t.amount.toLocaleString()}đ
                        </td>
                        <td className="whitespace-nowrap">
                          {new Date(t.transactionDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setTransactionModal({ isOpen: true, mode: "edit", data: t })}
                              className="p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                isOpen: true,
                                type: "transaction",
                                id: t.idTransaction,
                                name: t.transactionName
                              })}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--color-text)]">
                <p>Chưa có giao dịch nào</p>
                <button
                  onClick={() => setTransactionModal({ isOpen: true, mode: "add", data: null })}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                >
                  Thêm giao dịch đầu tiên
                </button>
              </div>
            )}
          </div>

          {/* Chart + Budget */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="rounded-xl bg-background shadow-sm border border-[var(--color-border)]/10 p-4 sm:p-5 flex flex-col items-center justify-center hover:shadow-md transition">
              <h2 className="text-base sm:text-lg font-semibold mb-3">Tỉ lệ chi tiêu</h2>
              {chartData.length > 0 ? (
                <Chart options={pieOptions} series={pieSeries} type="pie" width="260" />
              ) : (
                <p className="text-sm text-[var(--color-text)]">Chưa có dữ liệu</p>
              )}
            </div>

            {/* Budget List */}
            <div className="rounded-xl bg-background shadow-sm border border-[var(--color-border)]/10 p-4 sm:p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-semibold">Ngân sách</h2>
                <button
                  onClick={() => setBudgetModal({ isOpen: true, mode: "add", data: null })}
                  className="p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Thêm ngân sách"
                >
                  <Plus className="w-4 h-4 text-blue-500" />
                </button>
              </div>

              {budgetList.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto nice-scroll">
                  {budgetList.map((b) => {
                    const percent = Math.min(100, Math.round((b.currentBudget / b.budgetGoal) * 100));
                    return (
                      <div key={b.idBudget} className="group">
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{b.budgetName}</span>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                              <button
                                onClick={() => setDeleteModal({
                                  isOpen: true,
                                  type: "budget",
                                  id: b.idBudget,
                                  name: b.budgetName
                                })}
                                className="p-1 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </div>
                          </div>
                          <span className="font-semibold text-sm whitespace-nowrap">
                            {b.currentBudget.toLocaleString()}đ
                          </span>
                        </div>
                        <div className="w-full bg-gray-200/30 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${percent >= 90 ? 'bg-red-500' : percent >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-xs text-[var(--color-text)] mt-1">
                          {percent}% của {b.budgetGoal.toLocaleString()}đ
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-[var(--color-text)]">
                  <p>Chưa có ngân sách nào</p>
                  <button
                    onClick={() => setBudgetModal({ isOpen: true, mode: "add", data: null })}
                    className="mt-3 text-blue-500 hover:underline"
                  >
                    Thêm ngân sách
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
            <div className="text-lg font-semibold">Mục tiêu tiết kiệm</div>
            <button
              onClick={() => setSavingModal({ isOpen: true, mode: "add", data: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-amber-500 text-white shadow-xl cursor-pointer
            hover:bg-amber-600 active:scale-[0.97] transition-all text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" /> Thêm mục tiêu
            </button>
          </div>

          {savingList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {savingList.map((g) => {
                const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div
                    key={g.idSaving}
                    className="border border-[var(--color-border)]/10 bg-background rounded-xl p-4 hover:shadow-md transition group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{g.savingName}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            type: "saving",
                            id: g.idSaving,
                            name: g.savingName
                          })}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {g.targetDate && (
                      <span className="text-xs sm:text-sm text-[var(--color-text)] whitespace-nowrap">
                        {new Date(g.targetDate).toLocaleDateString('vi-VN')}
                      </span>
                    )}

                    <div className="text-base sm:text-lg font-bold text-amber-500 mb-1 mt-2">
                      {g.targetAmount.toLocaleString()}đ
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text)] mb-1">
                      {g.currentAmount.toLocaleString()}đ đã tiết kiệm ({percent}%)
                    </p>

                    <div className="w-full bg-gray-200/30 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full bg-amber-500 transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    {g.description && (
                      <p className="text-xs text-gray-500 italic break-words">
                        {g.description}
                      </p>
                    )}

                    <div className={`mt-2 px-2 py-1 rounded-full text-xs inline-block ${g.status === "Hoàn Thành"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-blue-500/10 text-blue-500"
                      }`}>
                      {g.status}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-[var(--color-border)]/10 bg-background rounded-xl">
              <p className="text-[var(--color-text)] mb-4">Chưa có mục tiêu tiết kiệm nào</p>
              <button
                onClick={() => setSavingModal({ isOpen: true, mode: "add", data: null })}
                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
              >
                Tạo mục tiêu đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddEditTransactionModal
        isOpen={transactionModal.isOpen}
        onClose={() => setTransactionModal({ isOpen: false, mode: "add", data: null })}
        onSubmit={handleTransactionSubmit}
        transaction={transactionModal.data}
        mode={transactionModal.mode}
        budgetList={budgetList}
      />

      <AddEditBudgetModal
        isOpen={budgetModal.isOpen}
        onClose={() => setBudgetModal({ isOpen: false, mode: "add", data: null })}
        onSubmit={handleBudgetSubmit}
        budget={budgetModal.data}
        mode={budgetModal.mode}
      />

      <AddEditSavingModal
        isOpen={savingModal.isOpen}
        onClose={() => setSavingModal({ isOpen: false, mode: "add", data: null })}
        onSubmit={handleSavingSubmit}
        saving={savingModal.data}
        mode={savingModal.mode}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: "", id: "", name: "" })}
        onConfirm={handleDelete}
        title={`Xóa ${deleteModal.type === "transaction" ? "giao dịch" : deleteModal.type === "budget" ? "ngân sách" : "mục tiêu"}`}
        message={`Bạn có chắc chắn muốn xóa "${deleteModal.name}"? Hành động này không thể hoàn tác.`}
        loading={deleteLoading}
      />
    </>
  );
};

export default FinanceDashboard;
