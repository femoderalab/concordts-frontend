// /**
//  * Payment Analytics Page - Admin only
//  * Beautiful, production-grade analytics dashboard
//  * Fully responsive: mobile-first, tablet, desktop
//  */

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import {
//   DollarSign, TrendingUp, CreditCard, Wallet,
//   RefreshCw, Printer, AlertCircle, CheckCircle,
//   Clock, XCircle, BarChart3, ArrowUpRight,
//   ArrowDownRight, Activity, Users, FileText, Calendar,
//   Filter, X, PieChart, Layers
// } from 'lucide-react';
// import { getPaymentStatistics } from '../../services/paymentService';
// import useAuth from '../../hooks/useAuth';

// // ── Animated counter hook ──────────────────────────────────────────────────
// const useCountUp = (target, duration = 1200, active = true) => {
//   const [value, setValue] = useState(0);
//   useEffect(() => {
//     if (!active || target === 0) { setValue(target); return; }
//     let start = 0;
//     const step = target / (duration / 16);
//     const timer = setInterval(() => {
//       start += step;
//       if (start >= target) { setValue(target); clearInterval(timer); }
//       else setValue(Math.floor(start));
//     }, 16);
//     return () => clearInterval(timer);
//   }, [target, active]);
//   return value;
// };

// // ── Helpers ────────────────────────────────────────────────────────────────
// const fmt = (n) =>
//   new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n || 0);

// const fmtShort = (n) => {
//   if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
//   if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
//   return fmt(n);
// };

// const pct = (val, total) => (total > 0 ? Math.round((val / total) * 100) : 0);

// // ── Mini bar chart ─────────────────────────────────────────────────────────
// const SparkBar = ({ data, color = '#22c55e' }) => {
//   const max = Math.max(...data.map(d => d.revenue), 1);
//   return (
//     <div className="flex items-end gap-px h-10 mt-2">
//       {data.slice(-12).map((d, i) => (
//         <div key={i} className="flex-1 rounded-sm transition-all duration-300"
//           style={{ height: `${Math.max(4, (d.revenue / max) * 40)}px`, background: color, opacity: d.revenue > 0 ? 1 : 0.2 }} />
//       ))}
//     </div>
//   );
// };

// // ── Donut chart (responsive) ────────────────────────────────────────────────
// const DonutChart = ({ paid, partial, overdue, pending }) => {
//   const total = paid + partial + overdue + pending || 1;
//   const segments = [
//     { val: paid, color: '#22c55e', label: 'Paid' },
//     { val: partial, color: '#f59e0b', label: 'Partial' },
//     { val: pending, color: '#94a3b8', label: 'Pending' },
//     { val: overdue, color: '#ef4444', label: 'Overdue' },
//   ];
//   let cumulative = 0;
//   const r = 38, cx = 50, cy = 50, strokeW = 12;
//   const circ = 2 * Math.PI * r;
//   return (
//     <div className="flex flex-col sm:flex-row items-center gap-6">
//       <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90 flex-shrink-0">
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
//         {segments.map((seg, i) => {
//           const segLen = (seg.val / total) * circ;
//           const offset = circ - cumulative * circ / total;
//           cumulative += seg.val;
//           return seg.val > 0 ? (
//             <circle key={i} cx={cx} cy={cy} r={r} fill="none"
//               stroke={seg.color} strokeWidth={strokeW}
//               strokeDasharray={`${segLen} ${circ - segLen}`}
//               strokeDashoffset={-((1 - (cumulative - seg.val) / total) * circ)}
//               style={{ transition: 'stroke-dasharray 0.8s ease' }} />
//           ) : null;
//         })}
//       </svg>
//       <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full sm:w-auto">
//         {segments.map((seg, i) => (
//           <div key={i} className="flex items-center gap-2 text-xs">
//             <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
//             <span className="text-gray-500 w-12">{seg.label}</span>
//             <span className="font-semibold text-gray-800">{seg.val}</span>
//             <span className="text-gray-400 hidden sm:inline">({pct(seg.val, total)}%)</span>
//             <span className="text-gray-400 sm:hidden text-[10px]">({pct(seg.val, total)}%)</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ── Progress bar ───────────────────────────────────────────────────────────
// const ProgressBar = ({ value, max, color = 'bg-green-500', label, amount }) => {
//   const w = max > 0 ? Math.min(100, (value / max) * 100) : 0;
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between text-xs mb-1.5 flex-wrap gap-1">
//         <span className="font-medium text-gray-700">{label}</span>
//         <span className="font-bold text-gray-800">{fmtShort(amount)}</span>
//       </div>
//       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//         <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${w}%` }} />
//       </div>
//     </div>
//   );
// };

// // ── Stat card (fully responsive) ──────────────────────────────────────────
// const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor, trend, isCurrency }) => {
//   const num = useCountUp(Number(value) || 0, 1000, true);
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200">
//       <div className="flex items-start justify-between mb-3 sm:mb-4">
//         <div className={`w-9 h-9 sm:w-11 sm:h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
//           <Icon size={18} className={`${iconColor} sm:w-5 sm:h-5`} />
//         </div>
//         {trend !== undefined && (
//           <span className={`inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
//             trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
//           }`}>
//             {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
//             {Math.abs(trend)}%
//           </span>
//         )}
//       </div>
//       <div>
//         <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
//           {isCurrency ? fmtShort(num) : num.toLocaleString()}
//         </p>
//         <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">{label}</p>
//         {sub && <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 line-clamp-1">{sub}</p>}
//       </div>
//     </div>
//   );
// };

// // ── Method pill ────────────────────────────────────────────────────────────
// const methodMeta = {
//   paystack: { label: 'Paystack / Card', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700' },
//   bank_transfer: { label: 'Bank Transfer', color: 'bg-purple-500', light: 'bg-purple-50 text-purple-700' },
//   cash: { label: 'Cash', color: 'bg-green-500', light: 'bg-green-50 text-green-700' },
//   card: { label: 'Card', color: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-700' },
//   ussd: { label: 'USSD', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700' },
//   cheque: { label: 'Cheque', color: 'bg-gray-500', light: 'bg-gray-100 text-gray-700' },
// };

// // ── Mobile Bottom Sheet Filter ────────────────────────────────────────────
// const MobileFilterSheet = ({ isOpen, onClose, dateRange, setDateRange, onApply, onClear }) => {
//   if (!isOpen) return null;
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
//       <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Filter by Date</h3>
//           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
//             <input type="date" value={dateRange.start}
//               onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
//             <input type="date" value={dateRange.end}
//               onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button onClick={onApply} className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium">
//               Apply Filter
//             </button>
//             {(dateRange.start || dateRange.end) && (
//               <button onClick={onClear} className="px-4 py-2.5 text-red-500 font-medium text-sm">
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ══════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ══════════════════════════════════════════════════════════════════════════
// const PaymentAnalytics = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [activeMethodTab, setActiveMethodTab] = useState(null);
//   const [showMobileFilter, setShowMobileFilter] = useState(false);

//   useEffect(() => { if (isAdmin) loadStats(); }, [isAdmin]);

//   const loadStats = async () => {
//     try {
//       setLoading(true); setError('');
//       const params = {};
//       if (dateRange.start) params.start_date = dateRange.start;
//       if (dateRange.end) params.end_date = dateRange.end;
//       const data = await getPaymentStatistics(params);
//       setStats(data);
//       if (data?.by_method) setActiveMethodTab(Object.keys(data.by_method)[0] || null);
//     } catch {
//       setError('Failed to load payment statistics. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilter = () => {
//     loadStats();
//     setShowMobileFilter(false);
//   };
//   const clearFilter = () => { 
//     setDateRange({ start: '', end: '' }); 
//     setTimeout(loadStats, 50);
//     setShowMobileFilter(false);
//   };

//   if (!isAdmin) {
//     return (
//       <DashboardLayout title="Access Denied">
//         <div className="flex items-center justify-center min-h-[60vh] px-4">
//           <div className="text-center">
//             <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="text-red-500" size={28} />
//             </div>
//             <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
//             <p className="text-gray-500 text-sm sm:text-base mb-4">Only administrators can view payment analytics.</p>
//             <button onClick={() => navigate('/dashboard')}
//               className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
//               Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const o = stats?.overall || {};
//   const inv = stats?.invoices || {};
//   const monthly = stats?.monthly_trend || [];
//   const byMethod = stats?.by_method || {};
//   const byClass = stats?.outstanding_by_class || [];
//   const maxClassOut = Math.max(...byClass.map(c => Number(c.total_outstanding)), 1);

//   return (
//     <DashboardLayout title="Payment Analytics">
//       <div className="space-y-4 sm:space-y-6 pb-12 px-3 sm:px-0">

//         {/* ── Header with filter controls ── */}
//         <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Analytics</h1>
//             <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Revenue insights and collection performance</p>
//           </div>
//           <div className="flex gap-2">
//             {/* Mobile Filter Button */}
//             <button 
//               onClick={() => setShowMobileFilter(true)}
//               className="sm:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
//             >
//               <Filter size={15} /> Filter
//             </button>
//             <button onClick={() => window.print()}
//               className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
//               <Printer size={15} className="hidden xs:inline" /> 
//               <span className="xs:inline hidden">Print</span>
//               <Printer size={15} className="xs:hidden" />
//             </button>
//             <button onClick={loadStats} disabled={loading}
//               className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-60">
//               <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> 
//               <span className="hidden sm:inline">Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* ── Desktop Date Filter (hidden on mobile) ── */}
//         <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//           <div className="flex flex-wrap items-end gap-3">
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
//               <input type="date" value={dateRange.start}
//                 onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
//                 className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
//               <input type="date" value={dateRange.end}
//                 onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
//                 className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
//             </div>
//             <button onClick={applyFilter}
//               className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
//               Apply
//             </button>
//             {(dateRange.start || dateRange.end) && (
//               <button onClick={clearFilter} className="px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium">
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Mobile Filter Sheet */}
//         <MobileFilterSheet 
//           isOpen={showMobileFilter}
//           onClose={() => setShowMobileFilter(false)}
//           dateRange={dateRange}
//           setDateRange={setDateRange}
//           onApply={applyFilter}
//           onClear={clearFilter}
//         />

//         {error && <Alert type="error" message={error} onClose={() => setError('')} />}

//         {loading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm animate-pulse">
//                 <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gray-100 rounded-xl mb-3 sm:mb-4" />
//                 <div className="h-6 sm:h-7 bg-gray-100 rounded w-20 sm:w-24 mb-2" />
//                 <div className="h-3 sm:h-4 bg-gray-100 rounded w-16 sm:w-20" />
//               </div>
//             ))}
//           </div>
//         ) : stats ? (
//           <>
//             {/* ── KPI Cards Grid (2 col mobile, 4 col desktop) ── */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//               <StatCard icon={DollarSign} label="Total Revenue" value={o.total_revenue || 0}
//                 iconBg="bg-emerald-50" iconColor="text-emerald-600" isCurrency
//                 sub={`${o.successful_payments || 0} successful`} />
//               <StatCard icon={CheckCircle} label="Successful Payments" value={o.successful_payments || 0}
//                 iconBg="bg-blue-50" iconColor="text-blue-600"
//                 sub={`${o.success_rate || 0}% success`} />
//               <StatCard icon={Clock} label="Pending Payments" value={o.pending_payments || 0}
//                 iconBg="bg-amber-50" iconColor="text-amber-600"
//                 sub="Awaiting verification" />
//               <StatCard icon={Activity} label="Collection Rate" value={inv.collection_rate || 0}
//                 iconBg="bg-purple-50" iconColor="text-purple-600"
//                 sub={`${inv.paid || 0} of ${inv.total || 0} paid`} />
//             </div>

//             {/* ── Revenue Summary + Invoice Overview (stack on mobile, side by side on desktop) ── */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

//               {/* Revenue summary card - full width on mobile */}
//               <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
//                 <div className="flex items-center gap-2 mb-1">
//                   <TrendingUp size={14} className="text-emerald-400 sm:w-4 sm:h-4" />
//                   <span className="text-xs sm:text-sm text-gray-300 font-medium">Total Revenue</span>
//                 </div>
//                 <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">{fmtShort(o.total_revenue || 0)}</p>
//                 <p className="text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-6 break-all">{fmt(o.total_revenue || 0)}</p>
//                 <div className="overflow-x-auto -mx-2 px-2">
//                   <SparkBar data={monthly} color="#34d399" />
//                 </div>
//                 <p className="text-[10px] sm:text-xs text-gray-400 mt-2">Last 12 months</p>
//                 <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-[10px] sm:text-xs text-gray-400">Outstanding</p>
//                     <p className="text-base sm:text-lg font-bold text-red-400">{fmtShort(inv.total_outstanding || 0)}</p>
//                   </div>
//                   <div>
//                     <p className="text-[10px] sm:text-xs text-gray-400">Failed</p>
//                     <p className="text-base sm:text-lg font-bold text-orange-400">{o.failed_payments || 0}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Invoice breakdown - full width on mobile */}
//               <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
//                 <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 sm:mb-5 gap-2">
//                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                     <FileText size={16} className="text-gray-400" /> Invoice Overview
//                   </h3>
//                   <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full self-start xs:self-auto">
//                     {inv.total || 0} total invoices
//                   </span>
//                 </div>
//                 <DonutChart
//                   paid={inv.paid || 0}
//                   partial={inv.partially_paid || 0}
//                   overdue={inv.overdue || 0}
//                   pending={(inv.total || 0) - (inv.paid || 0) - (inv.partially_paid || 0) - (inv.overdue || 0)}
//                 />
//                 <div className="mt-5 pt-4 border-t border-gray-50">
//                   <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
//                     {[
//                       { label: 'Outstanding', val: fmt(inv.total_outstanding || 0), color: 'text-red-500' },
//                       { label: 'Paid Invoices', val: inv.paid || 0, color: 'text-green-600' },
//                       { label: 'Collection Rate', val: `${inv.collection_rate || 0}%`, color: 'text-blue-600' },
//                     ].map((item, i) => (
//                       <div key={i} className="bg-gray-50 rounded-xl p-2 sm:p-3">
//                         <p className={`text-sm sm:text-base font-bold ${item.color}`}>{item.val}</p>
//                         <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">{item.label}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ── Monthly Revenue Trend (horizontal scroll on mobile) ── */}
//             {monthly.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
//                 <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 gap-2">
//                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                     <BarChart3 size={16} className="text-gray-400" /> Monthly Revenue Trend
//                   </h3>
//                   <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full self-start xs:self-auto">
//                     Last {monthly.length} months
//                   </span>
//                 </div>
//                 <div className="overflow-x-auto pb-2 -mx-2 px-2">
//                   <div className="min-w-[500px] sm:min-w-full">
//                     {/* Bar chart */}
//                     <div className="flex items-end gap-1 sm:gap-2 h-36 mb-2">
//                       {monthly.map((m, i) => {
//                         const maxRev = Math.max(...monthly.map(x => x.revenue), 1);
//                         const h = Math.max(4, (m.revenue / maxRev) * 136);
//                         const isLatest = i === monthly.length - 1;
//                         return (
//                           <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
//                             <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] sm:text-xs rounded-lg px-1.5 sm:px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
//                               {fmtShort(m.revenue)}<br/>{m.count} payments
//                             </div>
//                             <div
//                               className={`w-full rounded-t-md transition-all duration-500 ${isLatest ? 'bg-emerald-500' : 'bg-gray-200 group-hover:bg-gray-300'}`}
//                               style={{ height: `${h}px` }}
//                             />
//                           </div>
//                         );
//                       })}
//                     </div>
//                     {/* Labels */}
//                     <div className="flex gap-1 sm:gap-2">
//                       {monthly.map((m, i) => (
//                         <div key={i} className="flex-1 text-center">
//                           <span className="text-[10px] sm:text-xs text-gray-400 truncate block">{m.month.split(' ')[0]}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 {/* Summary row - responsive wrap */}
//                 <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-3 sm:gap-4">
//                   {monthly.slice(-3).reverse().map((m, i) => (
//                     <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
//                       <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-gray-300'}`} />
//                       <span className="text-gray-500">{m.month}:</span>
//                       <span className="font-semibold text-gray-800">{fmtShort(m.revenue)}</span>
//                       <span className="text-gray-400 text-[10px] sm:text-xs hidden xs:inline">({m.count} payments)</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* ── Payment Methods (responsive grid: 1 on mobile, 2 on tablet, 3 on desktop) ── */}
//             {Object.keys(byMethod).length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
//                 <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
//                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                     <CreditCard size={16} className="text-gray-400" /> Payment Methods
//                   </h3>
//                 </div>
//                 <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
//                   {Object.keys(byMethod).map(method => {
//                     const meta = methodMeta[method] || { label: method, light: 'bg-gray-100 text-gray-700' };
//                     return (
//                       <button key={method}
//                         onClick={() => setActiveMethodTab(method)}
//                         className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
//                           activeMethodTab === method ? meta.light + ' ring-1 ring-current' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
//                         }`}>
//                         {meta.label}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                   {Object.entries(byMethod).map(([method, data]) => {
//                     const meta = methodMeta[method] || { label: method, color: 'bg-gray-400', light: 'bg-gray-100 text-gray-700' };
//                     const totalRev = o.total_revenue || 1;
//                     const share = pct(data.amount, totalRev);
//                     return (
//                       <div key={method}
//                         className={`rounded-xl p-3 sm:p-4 border-2 transition-all cursor-pointer ${
//                           activeMethodTab === method ? 'border-gray-900 shadow-md' : 'border-gray-100 hover:border-gray-200'
//                         }`}
//                         onClick={() => setActiveMethodTab(method)}>
//                         <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-1">
//                           <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${meta.light}`}>
//                             {meta.label}
//                           </span>
//                           <span className="text-[10px] sm:text-xs text-gray-400">{share}%</span>
//                         </div>
//                         <p className="text-lg sm:text-xl font-bold text-gray-900">{fmtShort(data.amount)}</p>
//                         <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{data.count} transaction{data.count !== 1 ? 's' : ''}</p>
//                         <div className="mt-2 sm:mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                           <div className={`h-full ${meta.color} rounded-full transition-all duration-700`}
//                             style={{ width: `${share}%` }} />
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* ── Outstanding by Class (responsive list) ── */}
//             {byClass.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
//                 <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 gap-2">
//                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                     <Users size={16} className="text-gray-400" /> Outstanding Fees by Class
//                   </h3>
//                   <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full self-start xs:self-auto">
//                     {byClass.length} classes
//                   </span>
//                 </div>
//                 <div className="space-y-3 sm:space-y-4">
//                   {byClass.slice(0, 10).map((item, i) => {
//                     const amount = Number(item.total_outstanding);
//                     const barPct = pct(amount, maxClassOut);
//                     const colors = ['bg-red-500', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400'];
//                     const barColor = colors[Math.min(i, colors.length - 1)];
//                     return (
//                       <div key={i} className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
//                         <div className="xs:w-28 flex-shrink-0">
//                           <p className="text-sm font-medium text-gray-700 truncate">
//                             {item.student__class_level__name || 'Unknown'}
//                           </p>
//                           <p className="text-[10px] sm:text-xs text-gray-400">{item.student_count} student{item.student_count !== 1 ? 's' : ''}</p>
//                         </div>
//                         <div className="flex-1">
//                           <div className="h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
//                             <div className={`h-full ${barColor} rounded-full transition-all duration-700`}
//                               style={{ width: `${barPct}%` }} />
//                           </div>
//                         </div>
//                         <span className="text-sm font-bold text-gray-800 xs:w-24 text-left xs:text-right flex-shrink-0">
//                           {fmtShort(amount)}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 {byClass.length > 10 && (
//                   <p className="text-[10px] sm:text-xs text-gray-400 mt-4 text-center">
//                     Showing top 10 of {byClass.length} classes
//                   </p>
//                 )}
//                 <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-50 flex justify-between text-xs sm:text-sm">
//                   <span className="text-gray-500">Total Outstanding</span>
//                   <span className="font-bold text-red-600">{fmt(inv.total_outstanding || 0)}</span>
//                 </div>
//               </div>
//             )}

//             {/* ── Quick Stats Footer (2x2 on mobile, 4 on desktop) ── */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//               {[
//                 { label: 'Total Invoices', val: inv.total || 0, icon: FileText, bg: 'bg-gray-50', text: 'text-gray-700' },
//                 { label: 'Fully Paid', val: inv.paid || 0, icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700' },
//                 { label: 'Partially Paid', val: inv.partially_paid || 0, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700' },
//                 { label: 'Overdue', val: inv.overdue || 0, icon: XCircle, bg: 'bg-red-50', text: 'text-red-700' },
//               ].map((s, i) => (
//                 <div key={i} className={`${s.bg} rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3`}>
//                   <s.icon size={18} className={`${s.text} sm:w-5 sm:h-5`} />
//                   <div>
//                     <p className={`text-base sm:text-xl font-bold ${s.text}`}>{s.val}</p>
//                     <p className="text-[10px] sm:text-xs text-gray-500">{s.label}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="bg-white rounded-2xl border border-gray-100 p-10 sm:p-16 text-center">
//             <BarChart3 size={40} className="mx-auto text-gray-200 mb-4 sm:w-12 sm:h-12" />
//             <p className="text-gray-400 text-sm sm:text-base">No analytics data available yet.</p>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default PaymentAnalytics;


/**
 * Payment Analytics Page - Admin only
 * Beautiful, production-grade analytics dashboard
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import {
  DollarSign, TrendingUp, CreditCard, Wallet,
  RefreshCw, Printer, AlertCircle, CheckCircle,
  Clock, XCircle, BarChart3, ArrowUpRight,
  ArrowDownRight, Activity, Users, FileText, Calendar,
  Filter, X, PieChart, Layers
} from 'lucide-react';
import { getPaymentStatistics } from '../../services/paymentService';
import useAuth from '../../hooks/useAuth';

// ============================================
// DESIGN SYSTEM COMPONENTS
// ============================================

// Typography (Sora font assumed via global CSS)
const Text = ({ variant = 'body', children, className = '' }) => {
  const variants = {
    h1: 'text-2xl md:text-3xl font-bold',
    h2: 'text-xl md:text-2xl font-semibold',
    h3: 'text-lg md:text-xl font-semibold',
    h4: 'text-base md:text-lg font-medium',
    body: 'text-sm md:text-base',
    small: 'text-xs md:text-sm',
    caption: 'text-[10px] md:text-xs',
    tiny: 'text-[9px] md:text-[10px]',
  };
  return <div className={`${variants[variant]} text-gray-800 ${className}`}>{children}</div>;
};

// Primary Button (#D94801)
const Button = ({ children, variant = 'primary', size = 'medium', icon: Icon, onClick, loading, disabled, type = 'button', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    secondary: 'bg-[#1D2B49] text-white hover:bg-[#24385C] active:bg-[#324A74]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  const sizes = {
    large: 'h-12 px-5 text-sm',
    medium: 'h-10 px-4 text-sm',
    small: 'h-8 px-3 text-xs',
    tiny: 'h-7 px-2 text-[10px]',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <RefreshCw size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={size === 'tiny' ? 12 : size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-sm ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

// ── Animated counter hook ──────────────────────────────────────────────────
const useCountUp = (target, duration = 1200, active = true) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setValue(target); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, active]);
  return value;
};

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n || 0);

const fmtShort = (n) => {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
};

const pct = (val, total) => (total > 0 ? Math.round((val / total) * 100) : 0);

// ── Mini bar chart ─────────────────────────────────────────────────────────
const SparkBar = ({ data, color = '#D94801' }) => {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="flex items-end gap-px h-10 mt-2">
      {data.slice(-12).map((d, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all duration-300"
          style={{ height: `${Math.max(4, (d.revenue / max) * 40)}px`, background: color, opacity: d.revenue > 0 ? 1 : 0.2 }} />
      ))}
    </div>
  );
};

// ── Donut chart (responsive) ────────────────────────────────────────────────
const DonutChart = ({ paid, partial, overdue, pending }) => {
  const total = paid + partial + overdue + pending || 1;
  const segments = [
    { val: paid, color: '#22c55e', label: 'Paid' },
    { val: partial, color: '#f59e0b', label: 'Partial' },
    { val: pending, color: '#94a3b8', label: 'Pending' },
    { val: overdue, color: '#ef4444', label: 'Overdue' },
  ];
  let cumulative = 0;
  const r = 38, cx = 50, cy = 50, strokeW = 12;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90 flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeW} />
        {segments.map((seg, i) => {
          const segLen = (seg.val / total) * circ;
          const offset = circ - cumulative * circ / total;
          cumulative += seg.val;
          return seg.val > 0 ? (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={strokeW}
              strokeDasharray={`${segLen} ${circ - segLen}`}
              strokeDashoffset={-((1 - (cumulative - seg.val) / total) * circ)}
              style={{ transition: 'stroke-dasharray 0.8s ease' }} />
          ) : null;
        })}
      </svg>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full sm:w-auto">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <Text variant="tiny" className="text-gray-500 w-12">{seg.label}</Text>
            <Text variant="small" className="font-semibold text-gray-800">{seg.val}</Text>
            <Text variant="tiny" className="text-gray-400 hidden sm:inline">({pct(seg.val, total)}%)</Text>
            <Text variant="tiny" className="text-gray-400 sm:hidden">({pct(seg.val, total)}%)</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Progress bar ───────────────────────────────────────────────────────────
const ProgressBar = ({ value, max, color = 'bg-[#D94801]', label, amount }) => {
  const w = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1.5 flex-wrap gap-1">
        <Text variant="tiny" className="font-medium text-gray-700">{label}</Text>
        <Text variant="tiny" className="font-bold text-gray-800">{fmtShort(amount)}</Text>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
};

// ── Stat card (fully responsive) ──────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, iconBg, iconColor, trend, isCurrency }) => {
  const num = useCountUp(Number(value) || 0, 1000, true);
  return (
    <Card className="p-4 sm:p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`w-9 h-9 sm:w-11 sm:h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={`${iconColor} sm:w-5 sm:h-5`} />
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
            trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <Text variant="h3" className="font-bold text-gray-900 tracking-tight">
          {isCurrency ? fmtShort(num) : num.toLocaleString()}
        </Text>
        <Text variant="caption" className="font-medium text-gray-500 mt-0.5">{label}</Text>
        {sub && <Text variant="tiny" className="text-gray-400 mt-0.5 sm:mt-1 line-clamp-1">{sub}</Text>}
      </div>
    </Card>
  );
};

// ── Method pill ────────────────────────────────────────────────────────────
const methodMeta = {
  paystack: { label: 'Paystack / Card', color: 'bg-blue-500', light: 'bg-blue-50 text-blue-700' },
  bank_transfer: { label: 'Bank Transfer', color: 'bg-purple-500', light: 'bg-purple-50 text-purple-700' },
  cash: { label: 'Cash', color: 'bg-green-500', light: 'bg-green-50 text-green-700' },
  card: { label: 'Card', color: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-700' },
  ussd: { label: 'USSD', color: 'bg-orange-500', light: 'bg-orange-50 text-orange-700' },
  cheque: { label: 'Cheque', color: 'bg-gray-500', light: 'bg-gray-100 text-gray-700' },
};

// ── Mobile Bottom Sheet Filter ────────────────────────────────────────────
const MobileFilterSheet = ({ isOpen, onClose, dateRange, setDateRange, onApply, onClear }) => {
  const [localStart, setLocalStart] = useState(dateRange.start);
  const [localEnd, setLocalEnd] = useState(dateRange.end);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter by Date</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input type="date" value={localStart}
              onChange={e => setLocalStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input type="date" value={localEnd}
              onChange={e => setLocalEnd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => { setDateRange({ start: localStart, end: localEnd }); onApply(); onClose(); }} 
              className="flex-1"
            >
              Apply Filter
            </Button>
            {(localStart || localEnd) && (
              <button onClick={() => { setLocalStart(''); setLocalEnd(''); setDateRange({ start: '', end: '' }); onClear(); onClose(); }} 
                className="px-4 py-2 text-red-500 font-medium text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
const PaymentAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['head', 'hm', 'principal', 'vice_principal', 'accountant'].includes(user?.role);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeMethodTab, setActiveMethodTab] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { if (isAdmin) loadStats(); }, [isAdmin]);

  const loadStats = async () => {
    try {
      setLoading(true); setError('');
      const params = {};
      if (dateRange.start) params.start_date = dateRange.start;
      if (dateRange.end) params.end_date = dateRange.end;
      const data = await getPaymentStatistics(params);
      setStats(data);
      if (data?.by_method) setActiveMethodTab(Object.keys(data.by_method)[0] || null);
    } catch {
      setError('Failed to load payment statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    loadStats();
    setShowMobileFilter(false);
  };
  const clearFilter = () => { 
    setDateRange({ start: '', end: '' }); 
    setTimeout(loadStats, 50);
    setShowMobileFilter(false);
  };

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-500" size={28} />
            </div>
            <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
            <Text variant="body" className="text-gray-500 mb-4">Only administrators can view payment analytics.</Text>
            <Button variant="primary" size="small" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const o = stats?.overall || {};
  const inv = stats?.invoices || {};
  const monthly = stats?.monthly_trend || [];
  const byMethod = stats?.by_method || {};
  const byClass = stats?.outstanding_by_class || [];
  const maxClassOut = Math.max(...byClass.map(c => Number(c.total_outstanding)), 1);
  const hasActiveFilters = dateRange.start || dateRange.end;

  return (
    <DashboardLayout title="Payment Analytics">
      {/* Fixed height container with internal scrolling */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* Header */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <BarChart3 size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Payment Analytics</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Revenue insights and collection performance
              </Text>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setShowMobileFilter(true)}
                className="sm:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Filter size={15} /> Filter
              </button>
              <Button variant="outline" size="small" icon={Printer} onClick={() => window.print()}>
                Print
              </Button>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadStats} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>

          {/* Desktop Date Filter */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-3">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">From</label>
                <input type="date" value={dateRange.start}
                  onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">To</label>
                <input type="date" value={dateRange.end}
                  onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]" />
              </div>
              <Button variant="primary" size="small" onClick={applyFilter}>
                Apply
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="small" onClick={clearFilter}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          <MobileFilterSheet 
            isOpen={showMobileFilter}
            onClose={() => setShowMobileFilter(false)}
            dateRange={dateRange}
            setDateRange={setDateRange}
            onApply={applyFilter}
            onClear={clearFilter}
          />

          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        </div>

        {/* SCROLLABLE CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4 sm:p-5 animate-pulse">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gray-100 rounded-xl mb-3 sm:mb-4" />
                  <div className="h-6 sm:h-7 bg-gray-100 rounded w-20 sm:w-24 mb-2" />
                  <div className="h-3 sm:h-4 bg-gray-100 rounded w-16 sm:w-20" />
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-4 sm:space-y-6 pb-4">
              {/* KPI Cards Grid (2 col mobile, 4 col desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard icon={DollarSign} label="Total Revenue" value={o.total_revenue || 0}
                  iconBg="bg-emerald-50" iconColor="text-emerald-600" isCurrency
                  sub={`${o.successful_payments || 0} successful`} />
                <StatCard icon={CheckCircle} label="Successful Payments" value={o.successful_payments || 0}
                  iconBg="bg-blue-50" iconColor="text-blue-600"
                  sub={`${o.success_rate || 0}% success`} />
                <StatCard icon={Clock} label="Pending Payments" value={o.pending_payments || 0}
                  iconBg="bg-amber-50" iconColor="text-amber-600"
                  sub="Awaiting verification" />
                <StatCard icon={Activity} label="Collection Rate" value={inv.collection_rate || 0}
                  iconBg="bg-purple-50" iconColor="text-purple-600"
                  sub={`${inv.paid || 0} of ${inv.total || 0} paid`} />
              </div>

              {/* Revenue Summary + Invoice Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* Revenue summary card */}
                <Card className="lg:col-span-1 bg-gradient-to-br from-[#1D2B49] to-[#24385C] p-5 sm:p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <Text variant="tiny" className="text-gray-300 font-medium">Total Revenue</Text>
                  </div>
                  <Text variant="h2" className="font-bold text-white tracking-tight mb-1">{fmtShort(o.total_revenue || 0)}</Text>
                  <Text variant="tiny" className="text-gray-400 mb-4 sm:mb-6 break-all">{fmt(o.total_revenue || 0)}</Text>
                  <div className="overflow-x-auto -mx-2 px-2">
                    <SparkBar data={monthly} color="#D94801" />
                  </div>
                  <Text variant="tiny" className="text-gray-400 mt-2">Last 12 months</Text>
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                      <Text variant="tiny" className="text-gray-400">Outstanding</Text>
                      <Text variant="h4" className="font-bold text-red-400">{fmtShort(inv.total_outstanding || 0)}</Text>
                    </div>
                    <div>
                      <Text variant="tiny" className="text-gray-400">Failed</Text>
                      <Text variant="h4" className="font-bold text-orange-400">{o.failed_payments || 0}</Text>
                    </div>
                  </div>
                </Card>

                {/* Invoice breakdown */}
                <Card className="lg:col-span-2 p-5 sm:p-6">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 sm:mb-5 gap-2">
                    <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" /> Invoice Overview
                    </Text>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full self-start xs:self-auto">
                      {inv.total || 0} total invoices
                    </span>
                  </div>
                  <DonutChart
                    paid={inv.paid || 0}
                    partial={inv.partially_paid || 0}
                    overdue={inv.overdue || 0}
                    pending={(inv.total || 0) - (inv.paid || 0) - (inv.partially_paid || 0) - (inv.overdue || 0)}
                  />
                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      {[
                        { label: 'Outstanding', val: fmt(inv.total_outstanding || 0), color: 'text-red-500' },
                        { label: 'Paid Invoices', val: inv.paid || 0, color: 'text-green-600' },
                        { label: 'Collection Rate', val: `${inv.collection_rate || 0}%`, color: 'text-[#D94801]' },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-2 sm:p-3">
                          <Text variant="small" className={`font-bold ${item.color}`}>{item.val}</Text>
                          <Text variant="tiny" className="text-gray-400 mt-0.5">{item.label}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Monthly Revenue Trend */}
              {monthly.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 gap-2">
                    <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart3 size={16} className="text-gray-400" /> Monthly Revenue Trend
                    </Text>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full self-start xs:self-auto">
                      Last {monthly.length} months
                    </span>
                  </div>
                  <div className="overflow-x-auto pb-2 -mx-2 px-2">
                    <div className="min-w-[500px] sm:min-w-full">
                      <div className="flex items-end gap-1 sm:gap-2 h-36 mb-2">
                        {monthly.map((m, i) => {
                          const maxRev = Math.max(...monthly.map(x => x.revenue), 1);
                          const h = Math.max(4, (m.revenue / maxRev) * 136);
                          const isLatest = i === monthly.length - 1;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded-lg px-1.5 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                {fmtShort(m.revenue)}<br/>{m.count} payments
                              </div>
                              <div
                                className={`w-full rounded-t-md transition-all duration-500 ${isLatest ? 'bg-[#D94801]' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                                style={{ height: `${h}px` }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        {monthly.map((m, i) => (
                          <div key={i} className="flex-1 text-center">
                            <Text variant="tiny" className="text-gray-400 truncate block">{m.month.split(' ')[0]}</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-3 sm:gap-4">
                    {monthly.slice(-3).reverse().map((m, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#D94801]' : 'bg-gray-300'}`} />
                        <Text variant="tiny" className="text-gray-500">{m.month}:</Text>
                        <Text variant="tiny" className="font-semibold text-gray-800">{fmtShort(m.revenue)}</Text>
                        <Text variant="tiny" className="text-gray-400 hidden xs:inline">({m.count} payments)</Text>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Payment Methods */}
              {Object.keys(byMethod).length > 0 && (
                <Card className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" /> Payment Methods
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {Object.keys(byMethod).map(method => {
                      const meta = methodMeta[method] || { label: method, light: 'bg-gray-100 text-gray-700' };
                      return (
                        <button key={method}
                          onClick={() => setActiveMethodTab(method)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                            activeMethodTab === method ? meta.light + ' ring-1 ring-current' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                          }`}>
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(byMethod).map(([method, data]) => {
                      const meta = methodMeta[method] || { label: method, color: 'bg-gray-400', light: 'bg-gray-100 text-gray-700' };
                      const totalRev = o.total_revenue || 1;
                      const share = pct(data.amount, totalRev);
                      return (
                        <div key={method}
                          className={`rounded-xl p-3 sm:p-4 border-2 transition-all cursor-pointer ${
                            activeMethodTab === method ? 'border-[#D94801] shadow-md' : 'border-gray-100 hover:border-gray-200'
                          }`}
                          onClick={() => setActiveMethodTab(method)}>
                          <div className="flex items-center justify-between mb-2 sm:mb-3 flex-wrap gap-1">
                            <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg ${meta.light}`}>
                              {meta.label}
                            </span>
                            <Text variant="tiny" className="text-gray-400">{share}%</Text>
                          </div>
                          <Text variant="h4" className="font-bold text-gray-900">{fmtShort(data.amount)}</Text>
                          <Text variant="tiny" className="text-gray-400 mt-1">{data.count} transaction{data.count !== 1 ? 's' : ''}</Text>
                          <div className="mt-2 sm:mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${meta.color} rounded-full transition-all duration-700`}
                              style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Outstanding by Class */}
              {byClass.length > 0 && (
                <Card className="p-4 sm:p-6">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 gap-2">
                    <Text variant="small" className="font-semibold text-gray-900 flex items-center gap-2">
                      <Users size={16} className="text-gray-400" /> Outstanding Fees by Class
                    </Text>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full self-start xs:self-auto">
                      {byClass.length} classes
                    </span>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {byClass.slice(0, 10).map((item, i) => {
                      const amount = Number(item.total_outstanding);
                      const barPct = pct(amount, maxClassOut);
                      const colors = ['bg-red-500', 'bg-orange-400', 'bg-amber-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-blue-400'];
                      const barColor = colors[Math.min(i, colors.length - 1)];
                      return (
                        <div key={i} className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                          <div className="xs:w-28 flex-shrink-0">
                            <Text variant="small" className="font-medium text-gray-700 truncate">
                              {item.student__class_level__name || 'Unknown'}
                            </Text>
                            <Text variant="tiny" className="text-gray-400">{item.student_count} student{item.student_count !== 1 ? 's' : ''}</Text>
                          </div>
                          <div className="flex-1">
                            <div className="h-2 sm:h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor} rounded-full transition-all duration-700`}
                                style={{ width: `${barPct}%` }} />
                            </div>
                          </div>
                          <Text variant="small" className="font-bold text-gray-800 xs:w-24 text-left xs:text-right flex-shrink-0">
                            {fmtShort(amount)}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                  {byClass.length > 10 && (
                    <Text variant="tiny" className="text-gray-400 mt-4 text-center">
                      Showing top 10 of {byClass.length} classes
                    </Text>
                  )}
                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-50 flex justify-between text-xs sm:text-sm">
                    <Text variant="tiny" className="text-gray-500">Total Outstanding</Text>
                    <Text variant="small" className="font-bold text-red-600">{fmt(inv.total_outstanding || 0)}</Text>
                  </div>
                </Card>
              )}

              {/* Quick Stats Footer */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Total Invoices', val: inv.total || 0, icon: FileText, bg: 'bg-gray-50', text: 'text-gray-700' },
                  { label: 'Fully Paid', val: inv.paid || 0, icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700' },
                  { label: 'Partially Paid', val: inv.partially_paid || 0, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700' },
                  { label: 'Overdue', val: inv.overdue || 0, icon: XCircle, bg: 'bg-red-50', text: 'text-red-700' },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3`}>
                    <s.icon size={18} className={`${s.text} sm:w-5 sm:h-5`} />
                    <div>
                      <Text variant="h4" className={`font-bold ${s.text}`}>{s.val}</Text>
                      <Text variant="tiny" className="text-gray-500">{s.label}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-10 sm:p-16 text-center">
              <BarChart3 size={40} className="mx-auto text-gray-200 mb-4" />
              <Text variant="body" className="text-gray-400">No analytics data available yet.</Text>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentAnalytics;