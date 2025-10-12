'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/* ---------- helpers ---------- */
const fmtMoney = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);

const fmtNumber = (n: number, d = 6) =>
  Number(n).toLocaleString('en-US', { maximumFractionDigits: d });

const Trend = ({ v }: { v: number }) => {
  const up = v >= 0;
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        up
          ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20'
          : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-400/20',
      ].join(' ')}
      title={`${up ? '+' : ''}${v}%`}
    >
      {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {up ? '+' : ''}
      {v}%
    </span>
  );
};

/* ---------- mock data ---------- */
type Row = {
  name: string;
  symbol: string;
  icon: string; // image url (có thể đổi sang /crypto/btc.svg ...)
  marketcap: string;
  balanceUsd: number;
  price: number; // giả sử BTC price
  d7: number;
  d30: number;
  y1: number;
  today: number;
};

const MOCK_PORT: Row[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/btc.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 5.1,
    d30: -27.4,
    y1: 1.1,
    today: 7.7,
  },
  {
    name: 'Monero',
    symbol: 'XMR',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/xmr.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 4.2,
    d30: -14.3,
    y1: 0.8,
    today: 2.2,
  },
  {
    name: 'Somecoin',
    symbol: 'SMC',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/ada.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 2.7,
    d30: -8.1,
    y1: 0.5,
    today: -1.2,
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/ada.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 5.1,
    d30: -27.4,
    y1: 1.1,
    today: 2.7,
  },
  {
    name: 'ChainLink',
    symbol: 'LINK',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/link.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 5.1,
    d30: -27.4,
    y1: 1.4,
    today: -0.7,
  },
  {
    name: 'Coin',
    symbol: 'COIN',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/doge.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 1.5,
    d30: -2.4,
    y1: 0.3,
    today: 1.3,
  },
  {
    name: 'Etherum',
    symbol: 'ETH',
    icon: 'https://cryptofonts.s3.amazonaws.com/coins/eth.svg',
    marketcap: '20B',
    balanceUsd: 5777,
    price: 0.000038,
    d7: 3.2,
    d30: -12.4,
    y1: 0.9,
    today: 2.7,
  },
];



/* ---------- components ---------- */

export function PortfolioTable() {
  return (
    <div className="max-h-[400px] text-text overflow-auto nice-scroll rounded-2xl bg-background backdrop-blur p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="px-2 py-2 text-xl font-bold ">Danh mục đầu tư</div>

      {/* table */}
      <div className="overflow-x-autorounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="">
              <Th>Name</Th>
              <Th>Marketcap</Th>
              <Th className="text-right">Balance</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">7D</Th>
              <Th className="text-right">30D</Th>
              <Th className="text-right">1Y</Th>
              <Th className="text-right">Today</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PORT.map((r, idx) => (
              <tr
                key={r.symbol + idx}
                className="group border-t border-white/5 hover:bg-white/[0.03] transition-colors"
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <img
                      src={r.icon}
                      alt={r.symbol}
                      className="size-7 rounded-full ring-1 ring-white/10"
                    />
                    <div className="leading-tight">
                      <div className="font-semibold text-slate-100">{r.name}</div>
                      <div className="text-[11px] text-slate-400">{r.symbol}</div>
                    </div>
                  </div>
                </Td>
                <Td>{r.marketcap}</Td>
                <Td className="text-right">{fmtMoney(r.balanceUsd)}</Td>
                <Td className="text-right">{fmtNumber(r.price)}</Td>
                <Td className="text-right"><Trend v={r.d7} /></Td>
                <Td className="text-right"><Trend v={r.d30} /></Td>
                <Td className="text-right"><Trend v={r.y1} /></Td>
                <Td className="text-right"><Trend v={r.today} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function Th({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <th className={['py-2 px-3 font-medium text-left', className].join(' ')}>{children}</th>
  );
}

function Td({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={['py-3 px-3 align-middle', className].join(' ')}>{children}</td>;
}
