import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Activity = {
  title: string;
  time: string;
  amount: number;
  type: 'in' | 'out';
};

const MOCK_ACTIVITY: Activity[] = [
  { title: 'Bán ly rau', time: 'Hôm qua 03:06', amount: 11000, type: 'out' },
  { title: 'Mua ly rau', time: 'Hôm qua 03:06', amount: 11000, type: 'in' },
  { title: 'Bán ly rau', time: 'Hôm qua 03:06', amount: 11000, type: 'out' },
  { title: 'Mua ly rau', time: 'Hôm qua 03:06', amount: 10000, type: 'in' },
  { title: 'Bán ly rau', time: 'Hôm qua 03:06', amount: 11000, type: 'out' },
  { title: 'Mua ly rau', time: 'Hôm qua 03:06', amount: 11000, type: 'in' },
];


export function BalanceActivity() {
  return (
    <div className="max-h-[400px] nice-scroll overflow-y-scroll rounded-2xl  bg-background text-text backdrop-blur p-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="px-2 py-2 text-xl font-bold ">Biến động số dư</div>

      <ul className="mt-1 divide-y divide-white/5">
        {MOCK_ACTIVITY.map((a, i) => {
          const color =
            a.type === 'in'
              ? 'text-emerald-400 bg-emerald-500/10 ring-emerald-400/20'
              : 'text-rose-400 bg-rose-500/10 ring-rose-400/20';
          return (
            <li key={i} className="flex items-center justify-between p-3 hover:bg-white/[0.03] rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <span
                  className={[
                    'grid place-items-center size-10 rounded-xl ring-1',
                    color.split(' ').slice(1).join(' '), // giữ bg + ring từ color
                  ].join(' ')}
                >
                  {a.type === 'in' ? (
                    <ArrowUpRight className="size-5 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="size-5 text-rose-400" />
                  )}
                </span>
                <div className="leading-tight">
                  <div className="font-medium ">{a.title}</div>
                  <div className="text-[11px]">{a.time}</div>
                </div>
              </div>
              <div className="text-text font-semibold">
                {Intl.NumberFormat('vi-VN').format(a.amount)}<span className="text-slate-400 text-xs ml-1">vnd</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}