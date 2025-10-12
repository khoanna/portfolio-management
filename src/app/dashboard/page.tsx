'use client';

import Account from "@/components/dashboard/Account";
import { BalanceActivity } from "@/components/dashboard/Activity";
import DonutChart from "@/components/dashboard/DonutChart";
import { PortfolioTable } from "@/components/dashboard/Porfolio";
import TwoLineChart from "@/components/dashboard/TwoLineChart";


export default function DashBoard() {

  return (
    <div className="p-8 pt-6 bg-foreground flex flex-col gap-4">
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-3">
          <TwoLineChart />
        </div>
        <div className="col-span-2">
          <DonutChart />
        </div>
        <div className="col-span-2">
          <Account />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-4 ">
         <div className="col-span-5">
          <PortfolioTable />
        </div>
        <div className="col-span-2">
          <BalanceActivity />
        </div>
      </div>

    </div>
  )
}

