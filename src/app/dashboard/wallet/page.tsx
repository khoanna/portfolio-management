"use client";

import Button from "@/components/Button";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
}

interface Budget {
  id: number;
  name: string;
  spent: number;
  target: number;
}

interface Goal {
  id: number;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  note: string;
}

const FinanceDashboard: React.FC = () => {
  // Fake data
  const transactions: Transaction[] = [
    { id: 1, name: "Mua rau má", category: "Đồ ăn", amount: 360000, date: "03/06/2036" },
    { id: 2, name: "Cà phê với bạn", category: "Đi chơi", amount: 80000, date: "05/06/2036" },
  ];

  const budgets: Budget[] = [
    { id: 1, name: "Đồ ăn", spent: 1900000, target: 2000000 },
    { id: 2, name: "Đi chơi với NTK", spent: 870000, target: 1000000 },
    { id: 3, name: "Đặt linh tinh", spent: 870000, target: 1000000 },
  ];

  const goals: Goal[] = [
    { id: 1, name: "Đi Thanh Hoá", target: 10000000, saved: 5000000, deadline: "Sep, 2025", note: "mua nhiều rau má" },
    { id: 2, name: "Tiền bệnh", target: 5000000, saved: 500000, deadline: "Jan, 2027", note: "chữa bệnh" },
    { id: 3, name: "Mua xe mới", target: 2000000000, saved: 999999999, deadline: "Sep, 2026", note: "Mercedes GLC =))" },
  ];

  // Chart setup
  const pieOptions = {
    labels: ["Đặt linh tinh", "Đi chơi với NTK", "Ăn uống"],
    colors: ["#F59E0B", "#2EC4B6", "#9C27B0"],
    legend: { position: "bottom" as const },
    dataLabels: { enabled: false },
  };

  const pieSeries = [20, 30, 50];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="text-lg font-semibold">Thống kê</div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button title="Thêm ngân sách" />
          <Button title="Thêm giao dịch" />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Transaction table */}
        <div className="lg:col-span-6 rounded-xl bg-background shadow-sm border border-[var(--color-border)]/10 p-4 sm:p-5 transition-all hover:shadow-md">
          <h2 className="text-base sm:text-lg font-semibold mb-3">Lịch sử tiêu tiền</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-[var(--color-text)] border-b border-[var(--color-border)]/10">
                  <th className="text-left pb-2 whitespace-nowrap">Tên giao dịch</th>
                  <th className="text-left pb-2 whitespace-nowrap">Loại</th>
                  <th className="text-left pb-2 whitespace-nowrap">Số tiền</th>
                  <th className="text-left pb-2 whitespace-nowrap">Thời điểm</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[var(--color-border)]/5 hover:bg-[var(--foreground)]/50 transition"
                  >
                    <td className="py-2">{t.name}</td>
                    <td>{t.category}</td>
                    <td className="text-right font-medium whitespace-nowrap">{t.amount.toLocaleString()}đ</td>
                    <td className="whitespace-nowrap">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart + Budget */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-background shadow-sm border border-[var(--color-border)]/10 p-4 sm:p-5 flex flex-col items-center justify-center hover:shadow-md transition">
            <h2 className="text-base sm:text-lg font-semibold mb-3">Tỉ lệ chi tiêu</h2>
            <Chart options={pieOptions} series={pieSeries} type="pie" width="260" />
          </div>

          <div className="rounded-xl bg-background shadow-sm border border-[var(--color-border)]/10 p-4 sm:p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-semibold">Ngân sách</h2>
            </div>

            <div className="space-y-4">
              {budgets.map((b) => {
                const percent = Math.round((b.spent / b.target) * 100);
                return (
                  <div key={b.id}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{b.name}</span>
                      </div>
                      <span className="font-semibold text-sm whitespace-nowrap">{b.spent.toLocaleString()}đ</span>
                    </div>
                    <div className="w-full bg-gray-200/30 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#8B4513] transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-[var(--color-text)] mt-1">
                      {percent}% của {b.target.toLocaleString()}đ
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
          <div className="text-lg font-semibold">Mục tiêu tiết kiệm</div>
          <button
            className="px-4 py-2 rounded-lg font-semibold bg-background shadow-xl cursor-pointer
          hover:shadow-lg hover:brightness-110 active:scale-[0.97] transition-all text-sm sm:text-base w-full sm:w-auto"
          >
            + Thêm mục tiêu
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {goals.map((g) => {
            const percent = Math.round((g.saved / g.target) * 100);
            return (
              <div
                key={g.id}
                className="border border-[var(--color-border)]/10 bg-background rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm sm:text-base">{g.name}</h3>
                  <span className="text-xs sm:text-sm text-[var(--color-text)] whitespace-nowrap">{g.deadline}</span>
                </div>

                <div className="text-base sm:text-lg font-bold text-amber-500 mb-1">
                  {g.target.toLocaleString()}đ
                </div>
                <p className="text-xs sm:text-sm text-[var(--color-text)] mb-1">
                  {g.saved.toLocaleString()}đ đã tiết kiệm ({percent}%)
                </p>

                <div className="w-full bg-gray-200/30 rounded-full h-2 mb-2">
                  <div
                    className="h-2 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 italic break-words">Ghi chú: {g.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
