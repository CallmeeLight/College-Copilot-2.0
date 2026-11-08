import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Receipt,
  FileCheck
} from "lucide-react";
import { FeeItem } from "../types";

interface FeesScreenProps {
  feeItem: FeeItem;
  onPayFee: () => void;
}

export const FeesScreen: React.FC<FeesScreenProps> = ({ feeItem, onPayFee }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPayFee();
      setShowReceipt(true);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <span className="font-semibold">Tuition</span> & Campus Financials
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Official semester fee accounting &bull; Secure bursar portal simulation &bull; Instant receipt issuance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {feeItem.status === "paid" ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>All Fees Cleared for Semester 4</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Due in {feeItem.daysRemaining} Days</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Fee Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Primary Invoice & Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] sm:rounded-[40px] p-7 sm:p-8 border border-white/90 shadow-sm space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Semester 4 Academic Fee
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
                  {feeItem.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Due Date: {feeItem.dueDate} &bull; Student Roll: CC-2024-ENG-089
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Amount Payable</span>
                <span className="text-3xl font-mono font-bold text-slate-900">
                  ₹{feeItem.amount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  (approx. $545 USD)
                </span>
              </div>
            </div>

            {/* Itemized breakdown table */}
            <div className="space-y-3 pt-4 border-t border-slate-200/60">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Itemized Fee Breakdown
              </h3>

              <div className="space-y-2 text-xs">
                {feeItem.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-700 font-medium">{item.item}</span>
                    <span className="font-mono font-semibold text-slate-900">₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Balance Row */}
            <div className="flex items-center justify-between pt-2 text-sm font-semibold">
              <span className="text-slate-600">Total Semester Dues</span>
              <span className="text-xl font-mono font-bold text-indigo-600">₹{feeItem.amount.toLocaleString()}</span>
            </div>

            {/* Payment Call to action */}
            {feeItem.status === "due" ? (
              <div className="pt-2">
                <motion.button
                  id="pay-fees-portal-btn"
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  whileHover={{ scale: isProcessing ? 1 : 1.02, y: isProcessing ? 0 : -1 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="w-full py-3.5 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting to University Gateway...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Payment of ₹{feeItem.amount.toLocaleString()}</span>
                    </>
                  )}
                </motion.button>
                <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                  Protected with 256-bit university tokenized gateway encryption. No surcharge applied.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Paid on Sept 6, 2026 &bull; Reference #UNIV-PAY-882910</span>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setShowReceipt(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
                >
                  View Receipt
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Financial Help & Policy */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/60 backdrop-blur-xl rounded-[32px] p-6 sm:p-7 space-y-4 border border-white/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-600" />
              <span>Scholarships & Installment Plans</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              If you require a staggered installment scheme or have submitted for the Dean's Merit Scholarship, please visit the Finance & Bursar's Office in the Administration Tower (Room 102).
            </p>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 block">Bursar Support Hours</span>
              <p className="text-slate-500 font-medium">Monday – Friday: 09:30 AM – 04:30 PM</p>
              <p className="text-indigo-600 font-mono text-[11px] font-semibold">bursar@university.edu &bull; +1 (555) 019-2834</p>
            </div>
          </div>

          {/* Electronic Receipt Modal / Drawer */}
          {showReceipt && (
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 border border-emerald-200 space-y-3 shadow-md animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  Official Receipt #882910
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-medium">Sept 6, 2026</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Payment of ₹{feeItem.amount.toLocaleString()} received in full. Class registration hold cleared.
              </p>
              <motion.button
                type="button"
                onClick={() => setShowReceipt(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Receipt
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
