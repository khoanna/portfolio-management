'use client'

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Range = 'week' | 'month' | 'year';

function Tab({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={[
                'px-3 py-1.5 text-xs rounded-full transition-all cursor-pointer',
                active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/10',
            ].join(' ')}
        >
            {children}
        </button>
    );
}

export default function TwoLineChart() {
    const [range, setRange] = useState<Range>('month');

    const dataset = useMemo(() => {
        switch (range) {
            case 'week':
                return {
                    categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                    in: [12, 14, 9, 18, 15, 22, 17],
                    out: [20, 18, 25, 17, 21, 15, 14],
                };
            case 'year':
                return {
                    categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                    in: [12, 18, 25, 40, 33, 45, 39, 48, 44, 52, 49, 57],
                    out: [42, 36, 30, 28, 26, 20, 24, 22, 25, 23, 21, 20],
                };
            case 'month':
            default:
                return {
                    categories: ['W1', 'W2', 'W3', 'W4', 'W5'],
                    in: [9, 16, 13, 18, 14],
                    out: [19, 17, 23, 14, 12],
                };
        }
    }, [range]);

    const options = useMemo(() => ({
        chart: {
            toolbar: { show: false },
            foreColor: '#94a3b8',
            animations: { enabled: true, easing: 'easeinout', speed: 400 },
        },
        stroke: { curve: 'smooth' as const, width: 3 },
        colors: ['#ef4444', '#22c55e'], 
        legend: { position: 'top' as const, horizontalAlign: 'left' as const },
        markers: { size: 0, hover: { size: 5 } },
        xaxis: {
            categories: dataset.categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { fontSize: '12px' } },
        },
        yaxis: {
            labels: { style: { fontSize: '12px' } },
        },
        grid: {
            yaxis: { lines: { show: false } },
            xaxis: { lines: { show: false } },
            strokeDashArray: 0,
            padding: { left: 8, right: 8, top: 6, bottom: 0 },
        },
        tooltip: {
            theme: 'dark' as const,
            y: { formatter: (val: number) => `${val.toFixed(0)}k` },
        },
    }), [dataset.categories]);

    const series = useMemo(() => ([
        { name: 'Tiền ra', data: dataset.out },
        { name: 'Tiền vào', data: dataset.in },
    ]), [dataset]);

    return (
        <div className="rounded-2xl p-4 bg-background shadow-xl min-h-[340px]">

            <div style={{ height: 270 }}>
                <Chart options={options} series={series} type="line" height={270} />
            </div>

            <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-2">
                    <Tab  active={range === 'week'} onClick={() => setRange('week')}>
                        Theo tuần
                    </Tab>
                    <Tab active={range === 'month'} onClick={() => setRange('month')}>
                        Theo tháng
                    </Tab>
                    <Tab active={range === 'year'} onClick={() => setRange('year')}>
                        Theo năm
                    </Tab>
                </div>
                <button className="text-xs cursor-pointer text-slate-400 hover:text-slate-200 transition">
                    Chi tiết →
                </button>
            </div>
        </div>
    );
}