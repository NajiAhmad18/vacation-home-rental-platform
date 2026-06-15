import { useState } from "react";
import { FileText, DollarSign, BarChart3, TrendingUp } from "lucide-react";
import PaymentHistory from "./PaymentHistory";
import CommissionFees from "./CommissionFees";
import BalanceSheet from "./BalanceSheet";
import ProfitAndLoss from "./ProfitAndLoss";

const tabs = [
  { id: "payments", label: "Payment History", Icon: FileText },
  { id: "commission", label: "Commission & Fees", Icon: DollarSign },
  { id: "balance", label: "Balance Sheet", Icon: BarChart3 },
  { id: "pnl", label: "P&L Statement", Icon: TrendingUp },
];

export default function Reports() {
  const [tab, setTab] = useState("payments");

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        {tabs.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-md transition ${
                active
                  ? "bg-white text-slate-900 border border-b-white border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {tab === "payments" && <PaymentHistory />}
        {tab === "commission" && <CommissionFees />}
        {tab === "balance" && <BalanceSheet />}
        {tab === "pnl" && <ProfitAndLoss />}
      </div>
    </div>
  );
}
