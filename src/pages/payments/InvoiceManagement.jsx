// // /**
// //  * Invoice Management Page - Admin only
// //  * Class-card view → click class → see students in that class
// //  * Full invoice editing per student
// //  * No pagination, fixed bulk generate
// //  */

// // import React, { useState, useEffect, useMemo } from 'react';
// // import DashboardLayout from '../../components/dashboard/DashboardLayout';
// // import Alert from '../../components/common/Alert';
// // import Button from '../../components/common/Button';
// // import Modal from '../../components/common/modal';
// // import {
// //   FileText, Plus, RefreshCw, Search, CheckCircle, XCircle, Clock,
// //   AlertCircle, Eye, Layers, GraduationCap,
// //   ChevronLeft, Edit, Save, X, TrendingUp, Info
// // } from 'lucide-react';
// // import {
// //   getInvoices, generateInvoice, bulkGenerateInvoices, getInvoiceById
// // } from '../../services/paymentService';
// // import { getAcademicSessions, getAcademicTerms, getClassLevels } from '../../services/academicService';
// // import { getStudents } from '../../services/studentService';
// // import { put } from '../../services/api';
// // import useAuth from '../../hooks/useAuth';

// // // ── helpers ───────────────────────────────────────────────────────────────────

// // const fmt = (n) =>
// //   new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n || 0);

// // const fmtDate = (d) => {
// //   if (!d) return 'N/A';
// //   return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// // };

// // const STATUS_CFG = {
// //   paid:           { bg: 'bg-green-100 text-green-800',  icon: <CheckCircle size={11}/>, label: 'Paid' },
// //   pending:        { bg: 'bg-yellow-100 text-yellow-800',icon: <Clock size={11}/>,        label: 'Pending' },
// //   partially_paid: { bg: 'bg-blue-100 text-blue-800',   icon: <TrendingUp size={11}/>,   label: 'Partial' },
// //   overdue:        { bg: 'bg-red-100 text-red-800',      icon: <AlertCircle size={11}/>,  label: 'Overdue' },
// //   cancelled:      { bg: 'bg-gray-100 text-gray-600',   icon: <XCircle size={11}/>,      label: 'Cancelled' },
// // };
// // const StatusBadge = ({ status }) => {
// //   const c = STATUS_CFG[status] || STATUS_CFG.pending;
// //   return (
// //     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg}`}>
// //       {c.icon}{c.label}
// //     </span>
// //   );
// // };

// // const updateInvoice = async (id, data) => {
// //   try {
// //     const res = await put(`/payments/invoices/${id}/update/`, data);
// //     return res.data || res;
// //   } catch (err) { throw err; }
// // };

// // // ─────────────────────────────────────────────────────────────────────────────
// // export default function InvoiceManagement() {
// //   const { user } = useAuth();
// //   const isAdmin = ['head','hm','principal','vice_principal','accountant'].includes(user?.role);

// //   const [invoices,    setInvoices]    = useState([]);
// //   const [sessions,    setSessions]    = useState([]);
// //   const [terms,       setTerms]       = useState([]);
// //   const [classLevels, setClassLevels] = useState([]);
// //   const [students,    setStudents]    = useState([]);
// //   const [loading,     setLoading]     = useState(true);
// //   const [error,       setError]       = useState('');
// //   const [success,     setSuccess]     = useState('');

// //   // view state
// //   const [selectedClass, setSelectedClass] = useState(null);
// //   const [filterSession, setFilterSession] = useState('');
// //   const [filterTerm,    setFilterTerm]    = useState('');
// //   const [detailSearch,  setDetailSearch]  = useState('');
// //   const [detailStatus,  setDetailStatus]  = useState('');

// //   // modals
// //   const [showSingle, setShowSingle] = useState(false);
// //   const [showBulk,   setShowBulk]   = useState(false);
// //   const [showEdit,   setShowEdit]   = useState(false);
// //   const [showView,   setShowView]   = useState(false);
// //   const [selInv,     setSelInv]     = useState(null);
// //   const [modalLoad,  setModalLoad]  = useState(false);

// //   // forms
// //   const [singleForm,  setSingleForm]  = useState({ student_id:'', session_id:'', term_id:'' });
// //   const [stuSearch,   setStuSearch]   = useState('');
// //   const [stuSugg,     setStuSugg]     = useState([]);
// //   const [bulkForm,    setBulkForm]    = useState({ session_id:'', term_id:'', class_level_id:'' });
// //   const [editForm,    setEditForm]    = useState({ total_amount:'', due_date:'', notes:'', discount_amount:'0', discount_reason:'', fee_breakdown:[] });

// //   // ── load ──
// //   useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

// //   const loadAll = async () => {
// //     try {
// //       setLoading(true); setError('');
// //       const [invR, sesR, terR, clR, stuR] = await Promise.all([
// //         getInvoices().catch(()=>[]),
// //         getAcademicSessions().catch(()=>[]),
// //         getAcademicTerms().catch(()=>[]),
// //         getClassLevels().catch(()=>[]),
// //         getStudents({ limit:1000 }).catch(()=>({ results:[] })),
// //       ]);
// //       setInvoices(Array.isArray(invR) ? invR : (invR?.results || invR || []));
// //       setSessions(sesR?.results || sesR || []);
// //       setTerms(terR?.results   || terR || []);
// //       setClassLevels(clR?.results || clR || []);
// //       setStudents(stuR?.results || []);
// //     } catch { setError('Failed to load data.'); }
// //     finally { setLoading(false); }
// //   };

// //   // ── student suggestions ──
// //   useEffect(() => {
// //     if (stuSearch.length >= 2) {
// //       const q = stuSearch.toLowerCase();
// //       setStuSugg(
// //         students.filter(s =>
// //           `${s.user?.first_name} ${s.user?.last_name}`.toLowerCase().includes(q) ||
// //           s.admission_number?.toLowerCase().includes(q)
// //         ).slice(0,8)
// //       );
// //     } else setStuSugg([]);
// //   }, [stuSearch, students]);

// //   // ── derived ──
// //   const visible = useMemo(() => invoices.filter(inv => {
// //     const okS = !filterSession || String(inv.session) === String(filterSession);
// //     const okT = !filterTerm    || String(inv.term)    === String(filterTerm);
// //     return okS && okT;
// //   }), [invoices, filterSession, filterTerm]);

// //   const classCards = useMemo(() => {
// //     const map = {};
// //     visible.forEach(inv => {
// //       const cn = inv.class_level_name || 'Unassigned';
// //       if (!map[cn]) map[cn] = { name:cn, invoices:[], paid:0, pending:0, overdue:0, partial:0, total_due:0 };
// //       map[cn].invoices.push(inv);
// //       if      (inv.status==='paid')           map[cn].paid++;
// //       else if (inv.status==='overdue')        map[cn].overdue++;
// //       else if (inv.status==='partially_paid') map[cn].partial++;
// //       else                                    map[cn].pending++;
// //       map[cn].total_due += parseFloat(inv.balance_due||0);
// //     });
// //     return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name));
// //   }, [visible]);

// //   const stats = useMemo(() => ({
// //     total:   visible.length,
// //     paid:    visible.filter(i=>i.status==='paid').length,
// //     pending: visible.filter(i=>i.status==='pending'||i.status==='partially_paid').length,
// //     overdue: visible.filter(i=>i.status==='overdue').length,
// //   }), [visible]);

// //   const classInvoices = useMemo(() => {
// //     if (!selectedClass) return [];
// //     return visible.filter(inv => {
// //       const okCl = inv.class_level_name === selectedClass.name;
// //       const okSe = !detailSearch ||
// //         inv.student_name?.toLowerCase().includes(detailSearch.toLowerCase()) ||
// //         inv.student_admission?.toLowerCase().includes(detailSearch.toLowerCase()) ||
// //         inv.invoice_number?.toLowerCase().includes(detailSearch.toLowerCase());
// //       const okSt = !detailStatus || inv.status === detailStatus;
// //       return okCl && okSe && okSt;
// //     });
// //   }, [selectedClass, visible, detailSearch, detailStatus]);

// //   // ── handlers ──
// //   const handleSingle = async () => {
// //     if (!singleForm.student_id||!singleForm.session_id||!singleForm.term_id) {
// //       setError('Fill in all fields'); return;
// //     }
// //     try {
// //       setModalLoad(true); setError('');
// //       const res = await generateInvoice({
// //         student_id: parseInt(singleForm.student_id),
// //         session_id: parseInt(singleForm.session_id),
// //         term_id:    parseInt(singleForm.term_id),
// //       });
// //       if (res.success||res.invoice) {
// //         setSuccess('Invoice generated!'); setShowSingle(false);
// //         setSingleForm({student_id:'',session_id:'',term_id:''}); setStuSearch('');
// //         await loadAll(); setTimeout(()=>setSuccess(''),4000);
// //       } else setError(res.error||'Failed');
// //     } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
// //     finally { setModalLoad(false); }
// //   };

// //   const handleBulk = async () => {
// //     if (!bulkForm.session_id||!bulkForm.term_id) { setError('Select session and term'); return; }
// //     try {
// //       setModalLoad(true); setError('');
// //       const payload = {
// //         session_id: parseInt(bulkForm.session_id),
// //         term_id:    parseInt(bulkForm.term_id),
// //       };
// //       if (bulkForm.class_level_id) payload.class_level_id = parseInt(bulkForm.class_level_id);
// //       const res = await bulkGenerateInvoices(payload);
// //       const created = res.generated_count ?? res.created_count ?? 0;
// //       const skip    = res.errors_count ?? 0;
// //       setSuccess(`Generated ${created} invoice${created!==1?'s':''}${skip>0?` · ${skip} skipped (already exist)`:''}`);
// //       setShowBulk(false); setBulkForm({session_id:'',term_id:'',class_level_id:''});
// //       await loadAll(); setTimeout(()=>setSuccess(''),6000);
// //     } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
// //     finally { setModalLoad(false); }
// //   };

// //   const openEdit = (inv) => {
// //     setSelInv(inv);
// //     setEditForm({
// //       total_amount:    String(inv.total_amount||''),
// //       due_date:        inv.due_date?.slice(0,10)||'',
// //       notes:           inv.notes||'',
// //       discount_amount: String(inv.discount_amount||'0'),
// //       discount_reason: inv.discount_reason||'',
// //       fee_breakdown:   inv.fee_breakdown ? JSON.parse(JSON.stringify(inv.fee_breakdown)) : [],
// //     });
// //     setError(''); setShowEdit(true);
// //   };

// //   const saveEdit = async () => {
// //     if (!selInv) return;
// //     try {
// //       setModalLoad(true); setError('');
// //       const res = await updateInvoice(selInv.id, {
// //         total_amount:    parseFloat(editForm.total_amount)||0,
// //         due_date:        editForm.due_date,
// //         notes:           editForm.notes,
// //         discount_amount: parseFloat(editForm.discount_amount)||0,
// //         discount_reason: editForm.discount_reason,
// //         fee_breakdown:   editForm.fee_breakdown,
// //       });
// //       if (res.success||res.invoice) {
// //         setSuccess('Invoice updated!'); setShowEdit(false);
// //         await loadAll(); setTimeout(()=>setSuccess(''),4000);
// //       } else setError(res.error||'Failed');
// //     } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
// //     finally { setModalLoad(false); }
// //   };

// //   const openView = async (inv) => {
// //     try { setModalLoad(true); const f=await getInvoiceById(inv.id); setSelInv(f?.data||f||inv); }
// //     catch { setSelInv(inv); } finally { setModalLoad(false); setShowView(true); }
// //   };

// //   const addFeeItem   = () => setEditForm(p=>({...p, fee_breakdown:[...p.fee_breakdown,{name:'',amount:0}]}));
// //   const removeFeeItem= (i) => setEditForm(p=>({...p, fee_breakdown:p.fee_breakdown.filter((_,ix)=>ix!==i)}));
// //   const updateFeeItem= (i,field,val) => setEditForm(p=>{
// //     const fb=[...p.fee_breakdown];
// //     fb[i]={...fb[i],[field]:field==='amount'?parseFloat(val)||0:val};
// //     const tot=fb.reduce((s,x)=>s+(parseFloat(x.amount)||0),0);
// //     return {...p,fee_breakdown:fb,total_amount:String(tot)};
// //   });

// //   if (!isAdmin) return (
// //     <DashboardLayout title="Access Denied">
// //       <div className="text-center py-20"><AlertCircle size={48} className="mx-auto text-gray-300 mb-3"/><p className="text-gray-500">Access denied</p></div>
// //     </DashboardLayout>
// //   );

// //   // ── class detail ──────────────────────────────────────────────
// //   const ClassDetail = () => (
// //     <div className="space-y-4">
// //       <div className="flex items-center gap-3">
// //         <button onClick={()=>{setSelectedClass(null);setDetailSearch('');setDetailStatus('');}} className="p-2 hover:bg-gray-100 rounded-lg">
// //           <ChevronLeft size={20}/>
// //         </button>
// //         <div>
// //           <h2 className="text-xl font-bold text-gray-800">{selectedClass.name}</h2>
// //           <p className="text-sm text-gray-500">{classInvoices.length} invoice{classInvoices.length!==1?'s':''}</p>
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-xl border p-4 flex flex-col md:flex-row gap-3">
// //         <div className="flex-1 relative">
// //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
// //           <input type="text" value={detailSearch} onChange={e=>setDetailSearch(e.target.value)}
// //             placeholder="Search student or invoice #…"
// //             className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"/>
// //         </div>
// //         <select value={detailStatus} onChange={e=>setDetailStatus(e.target.value)}
// //           className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
// //           <option value="">All Statuses</option>
// //           <option value="pending">Pending</option>
// //           <option value="paid">Paid</option>
// //           <option value="partially_paid">Partially Paid</option>
// //           <option value="overdue">Overdue</option>
// //         </select>
// //       </div>

// //       <div className="bg-white rounded-xl border overflow-hidden">
// //         {classInvoices.length===0 ? (
// //           <div className="text-center py-12 text-gray-500">No invoices match your filters.</div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full">
// //               <thead className="bg-gray-50">
// //                 <tr>{['Invoice #','Student','Total','Paid','Balance','Due Date','Status','Actions'].map(h=>(
// //                   <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
// //                 ))}</tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-100">
// //                 {classInvoices.map(inv=>(
// //                   <tr key={inv.id} className="hover:bg-gray-50">
// //                     <td className="px-4 py-3 text-sm font-mono text-blue-600 whitespace-nowrap">{inv.invoice_number}</td>
// //                     <td className="px-4 py-3 whitespace-nowrap">
// //                       <div className="font-medium text-sm text-gray-800">{inv.student_name}</div>
// //                       <div className="text-xs text-gray-400">{inv.student_admission}</div>
// //                     </td>
// //                     <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">{fmt(inv.total_amount)}</td>
// //                     <td className="px-4 py-3 text-sm text-green-600 whitespace-nowrap">{fmt(inv.amount_paid)}</td>
// //                     <td className="px-4 py-3 text-sm text-red-600 font-bold whitespace-nowrap">{fmt(inv.balance_due)}</td>
// //                     <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{fmtDate(inv.due_date)}</td>
// //                     <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={inv.status}/></td>
// //                     <td className="px-4 py-3 whitespace-nowrap">
// //                       <div className="flex gap-1">
// //                         <button onClick={()=>openView(inv)} title="View" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={15}/></button>
// //                         <button onClick={()=>openEdit(inv)} title="Edit" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><Edit size={15}/></button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );

// //   // ── card grid ─────────────────────────────────────────────────
// //   const CardGrid = () => (
// //     <div className="space-y-6">
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //         {[
// //           {label:'Total Invoices',value:stats.total,  color:'bg-blue-100 text-blue-600',   icon:<FileText size={18}/>},
// //           {label:'Paid',          value:stats.paid,   color:'bg-green-100 text-green-600', icon:<CheckCircle size={18}/>},
// //           {label:'Pending',       value:stats.pending,color:'bg-yellow-100 text-yellow-600',icon:<Clock size={18}/>},
// //           {label:'Overdue',       value:stats.overdue,color:'bg-red-100 text-red-600',     icon:<AlertCircle size={18}/>},
// //         ].map(s=>(
// //           <div key={s.label} className="bg-white rounded-xl border p-4 flex items-center gap-3">
// //             <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
// //             <div><p className="text-2xl font-bold text-gray-800">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
// //           </div>
// //         ))}
// //       </div>

// //       {loading ? (
// //         <div className="flex justify-center py-16"><RefreshCw className="animate-spin h-8 w-8 text-blue-500"/></div>
// //       ) : classCards.length===0 ? (
// //         <div className="bg-white rounded-xl border p-16 text-center">
// //           <FileText size={52} className="mx-auto text-gray-200 mb-4"/>
// //           <p className="text-gray-600 font-semibold mb-1">No invoices generated yet</p>
// //           <p className="text-gray-400 text-sm mb-6">Use "Bulk Generate" to create invoices for all students at once.</p>
// //           <Button onClick={()=>setShowBulk(true)} className="bg-blue-600 hover:bg-blue-700 mx-auto">
// //             <Layers size={15} className="mr-2"/> Bulk Generate Invoices
// //           </Button>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //           {classCards.map(card=>{
// //             const tot=card.invoices.length;
// //             const pct=tot>0?Math.round((card.paid/tot)*100):0;
// //             return (
// //               <button key={card.name} onClick={()=>setSelectedClass(card)}
// //                 className="bg-white rounded-xl border hover:border-blue-400 hover:shadow-md transition-all text-left p-5 group">
// //                 <div className="flex items-start justify-between mb-3">
// //                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
// //                     <GraduationCap size={18} className="text-blue-600"/>
// //                   </div>
// //                   <span className="text-xs text-gray-400 group-hover:text-blue-500">{tot} student{tot!==1?'s':''}</span>
// //                 </div>
// //                 <p className="font-bold text-gray-800 mb-0.5">{card.name}</p>
// //                 <p className="text-xs text-red-500 font-medium mb-3">{fmt(card.total_due)} outstanding</p>
// //                 <div className="mb-3">
// //                   <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Progress</span><span>{pct}%</span></div>
// //                   <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
// //                     <div className="h-full bg-green-500 rounded-full transition-all" style={{width:`${pct}%`}}/>
// //                   </div>
// //                 </div>
// //                 <div className="flex flex-wrap gap-1.5">
// //                   {card.paid    >0&&<span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">{card.paid} paid</span>}
// //                   {card.pending >0&&<span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">{card.pending} pending</span>}
// //                   {card.partial >0&&<span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{card.partial} partial</span>}
// //                   {card.overdue >0&&<span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs">{card.overdue} overdue</span>}
// //                 </div>
// //               </button>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );

// //   // ── render ────────────────────────────────────────────────────
// //   return (
// //     <DashboardLayout title="Invoice Management">
// //       <div className="space-y-6 pb-10">

// //         {/* top bar */}
// //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
// //           </div>
// //           <div className="flex items-center gap-2 flex-wrap">
// //             <select value={filterSession} onChange={e=>{setFilterSession(e.target.value);setSelectedClass(null);}}
// //               className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
// //               <option value="">All Sessions</option>
// //               {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
// //             </select>
// //             <select value={filterTerm} onChange={e=>{setFilterTerm(e.target.value);setSelectedClass(null);}}
// //               className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500">
// //               <option value="">All Terms</option>
// //               {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
// //             </select>
// //             <Button onClick={()=>setShowBulk(true)} variant="outline" className="flex items-center gap-2">
// //               <Layers size={15}/> Bulk Generate
// //             </Button>
// //             <Button onClick={()=>setShowSingle(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
// //               <Plus size={15}/> Generate Invoice
// //             </Button>
// //             <button onClick={loadAll} className="p-2 border rounded-lg hover:bg-gray-50">
// //               <RefreshCw size={16} className={loading?'animate-spin':''}/>
// //             </button>
// //           </div>
// //         </div>

// //         {error   && <Alert type="error"   message={error}   onClose={()=>setError('')}/>}
// //         {success && <Alert type="success" message={success} onClose={()=>setSuccess('')}/>}

// //         {selectedClass ? <ClassDetail/> : <CardGrid/>}
// //       </div>

// //       {/* ══ Single generate modal ══ */}
// //       <Modal isOpen={showSingle} onClose={()=>{setShowSingle(false);setStuSearch('');setSingleForm({student_id:'',session_id:'',term_id:''});setError('');}} title="Generate Invoice for One Student" size="md">
// //         <div className="py-4 space-y-4">
// //           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
// //             A fee structure must exist for the student's class, session, and term.
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1.5">Student *</label>
// //             <input type="text" value={stuSearch} onChange={e=>{setStuSearch(e.target.value);if(!e.target.value)setSingleForm(p=>({...p,student_id:''}));}}
// //               placeholder="Type student name or admission number…"
// //               className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"/>
// //             {stuSugg.length>0&&(
// //               <div className="border rounded-lg mt-1 max-h-44 overflow-y-auto shadow-lg bg-white relative z-20">
// //                 {stuSugg.map(s=>(
// //                   <button key={s.id} type="button"
// //                     onClick={()=>{setSingleForm(p=>({...p,student_id:s.id}));setStuSearch(`${s.user?.first_name||''} ${s.user?.last_name||''} (${s.admission_number})`);setStuSugg([]);}}
// //                     className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0 flex justify-between">
// //                     <span className="font-medium">{s.user?.first_name} {s.user?.last_name}</span>
// //                     <span className="text-gray-400 text-xs">{s.admission_number}·{s.class_level?.name}</span>
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //             {singleForm.student_id&&<p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11}/> Student selected</p>}
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1.5">Session *</label>
// //             <select value={singleForm.session_id} onChange={e=>setSingleForm(p=>({...p,session_id:e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
// //               <option value="">Select Session</option>
// //               {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1.5">Term *</label>
// //             <select value={singleForm.term_id} onChange={e=>setSingleForm(p=>({...p,term_id:e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
// //               <option value="">Select Term</option>
// //               {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
// //             </select>
// //           </div>
// //           {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2"><AlertCircle size={14}/>{error}</p>}
// //           <div className="flex gap-3 pt-1">
// //             <Button type="button" onClick={()=>{setShowSingle(false);setError('');}} variant="outline" className="flex-1">Cancel</Button>
// //             <Button onClick={handleSingle} loading={modalLoad} className="flex-1 bg-blue-600 hover:bg-blue-700">Generate</Button>
// //           </div>
// //         </div>
// //       </Modal>

// //       {/* ══ Bulk modal ══ */}
// //       <Modal isOpen={showBulk} onClose={()=>{setShowBulk(false);setError('');}} title="Bulk Generate Invoices" size="md">
// //         <div className="py-4 space-y-4">
// //           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
// //             <p className="font-semibold">How this works:</p>
// //             <p>• Generates invoices for <strong>all active students</strong> for the selected session + term.</p>
// //             <p>• Students who <strong>already have an invoice</strong> are automatically skipped.</p>
// //             <p>• Leave "Class Level" blank to generate for <strong>all classes at once</strong>.</p>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1.5">Session *</label>
// //             <select value={bulkForm.session_id} onChange={e=>setBulkForm(p=>({...p,session_id:e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
// //               <option value="">Select Session</option>
// //               {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1.5">Term *</label>
// //             <select value={bulkForm.term_id} onChange={e=>setBulkForm(p=>({...p,term_id:e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
// //               <option value="">Select Term</option>
// //               {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
// //             </select>
// //           </div>
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1.5">
// //               Class Level <span className="text-gray-400 font-normal">(optional — blank = all classes)</span>
// //             </label>
// //             <select value={bulkForm.class_level_id} onChange={e=>setBulkForm(p=>({...p,class_level_id:e.target.value}))} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
// //               <option value="">All Classes</option>
// //               {classLevels.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}
// //             </select>
// //           </div>
// //           {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2"><AlertCircle size={14}/>{error}</p>}
// //           <div className="flex gap-3 pt-1">
// //             <Button type="button" onClick={()=>{setShowBulk(false);setError('');}} variant="outline" className="flex-1">Cancel</Button>
// //             <Button onClick={handleBulk} loading={modalLoad} className="flex-1 bg-blue-600 hover:bg-blue-700">
// //               <Layers size={15} className="mr-2"/> Generate Now
// //             </Button>
// //           </div>
// //         </div>
// //       </Modal>

// //       {/* ══ Edit invoice modal ══ */}
// //       <Modal isOpen={showEdit} onClose={()=>{setShowEdit(false);setError('');}} title="Edit Invoice" size="lg">
// //         {selInv&&(
// //           <div className="py-4 max-h-[75vh] overflow-y-auto space-y-5">
// //             <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-start">
// //               <div>
// //                 <p className="font-semibold text-gray-800">{selInv.student_name}</p>
// //                 <p className="text-xs text-gray-500">{selInv.student_admission} · {selInv.class_level_name}</p>
// //                 <p className="text-xs text-gray-400">{selInv.session_name} — {selInv.term_name}</p>
// //               </div>
// //               <p className="font-mono text-sm text-blue-600">{selInv.invoice_number}</p>
// //             </div>

// //             {/* Fee breakdown editor */}
// //             <div>
// //               <div className="flex justify-between items-center mb-2">
// //                 <p className="text-sm font-semibold text-gray-700">Fee Breakdown</p>
// //                 <button type="button" onClick={addFeeItem} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
// //                   <Plus size={12}/> Add item
// //                 </button>
// //               </div>
// //               <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
// //                 {editForm.fee_breakdown.length===0&&<p className="text-xs text-gray-400 text-center py-2">No items. Click "Add item".</p>}
// //                 {editForm.fee_breakdown.map((item,i)=>(
// //                   <div key={i} className="flex gap-2 items-center">
// //                     <input type="text" value={item.name} onChange={e=>updateFeeItem(i,'name',e.target.value)}
// //                       placeholder="Fee name" className="flex-1 px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-blue-500"/>
// //                     <input type="number" value={item.amount} onChange={e=>updateFeeItem(i,'amount',e.target.value)}
// //                       placeholder="Amount" className="w-36 px-2 py-1.5 border rounded text-sm focus:ring-1 focus:ring-blue-500"/>
// //                     <button type="button" onClick={()=>removeFeeItem(i)} className="text-red-400 hover:text-red-600 p-1"><X size={14}/></button>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Amount (₦) <span className="text-xs text-gray-400">auto from breakdown</span></label>
// //                 <input type="number" value={editForm.total_amount} onChange={e=>setEditForm(p=>({...p,total_amount:e.target.value}))}
// //                   className="w-full px-3 py-2 border rounded-lg text-sm bg-blue-50 focus:ring-2 focus:ring-blue-500"/>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
// //                 <input type="date" value={editForm.due_date} onChange={e=>setEditForm(p=>({...p,due_date:e.target.value}))}
// //                   className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"/>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Amount (₦)</label>
// //                 <input type="number" value={editForm.discount_amount} onChange={e=>setEditForm(p=>({...p,discount_amount:e.target.value}))}
// //                   min="0" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"/>
// //               </div>
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Reason</label>
// //                 <input type="text" value={editForm.discount_reason} onChange={e=>setEditForm(p=>({...p,discount_reason:e.target.value}))}
// //                   placeholder="e.g. Scholarship, Sibling discount"
// //                   className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"/>
// //               </div>
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes / Remarks</label>
// //               <textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} rows={2}
// //                 className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
// //                 placeholder="Any notes for this invoice…"/>
// //             </div>

// //             <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1 border">
// //               <div className="flex justify-between"><span className="text-gray-500">Total:</span><span className="font-bold">{fmt(parseFloat(editForm.total_amount)||0)}</span></div>
// //               <div className="flex justify-between text-orange-600"><span>Discount:</span><span>- {fmt(parseFloat(editForm.discount_amount)||0)}</span></div>
// //               <div className="flex justify-between font-bold border-t pt-1 text-blue-700">
// //                 <span>Net Amount:</span>
// //                 <span>{fmt((parseFloat(editForm.total_amount)||0)-(parseFloat(editForm.discount_amount)||0))}</span>
// //               </div>
// //             </div>

// //             {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2"><AlertCircle size={14}/>{error}</p>}

// //             <div className="flex gap-3 pt-1">
// //               <Button type="button" onClick={()=>{setShowEdit(false);setError('');}} variant="outline" className="flex-1">Cancel</Button>
// //               <Button onClick={saveEdit} loading={modalLoad} className="flex-1 bg-orange-500 hover:bg-orange-600">
// //                 <Save size={15} className="mr-2"/> Save Changes
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>

// //       {/* ══ View invoice modal ══ */}
// //       <Modal isOpen={showView} onClose={()=>setShowView(false)} title="Invoice Details" size="md">
// //         {selInv&&(
// //           <div className="py-4 space-y-4">
// //             <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
// //               <div>
// //                 <p className="text-xs text-gray-400">Invoice</p>
// //                 <p className="font-mono font-bold text-blue-600">{selInv.invoice_number}</p>
// //               </div>
// //               <StatusBadge status={selInv.status}/>
// //             </div>
// //             <div className="grid grid-cols-2 gap-3 text-sm">
// //               <div><p className="text-xs text-gray-400">Student</p><p className="font-medium">{selInv.student_name}</p></div>
// //               <div><p className="text-xs text-gray-400">Admission #</p><p className="font-medium">{selInv.student_admission}</p></div>
// //               <div><p className="text-xs text-gray-400">Class</p><p className="font-medium">{selInv.class_level_name}</p></div>
// //               <div><p className="text-xs text-gray-400">Session · Term</p><p className="font-medium">{selInv.session_name} · {selInv.term_name}</p></div>
// //               <div><p className="text-xs text-gray-400">Issue Date</p><p className="font-medium">{fmtDate(selInv.issue_date)}</p></div>
// //               <div><p className="text-xs text-gray-400">Due Date</p><p className="font-medium">{fmtDate(selInv.due_date)}</p></div>
// //             </div>
// //             {selInv.fee_breakdown?.length>0&&(
// //               <div>
// //                 <p className="text-sm font-semibold text-gray-700 mb-2">Fee Breakdown</p>
// //                 <div className="border rounded-lg overflow-hidden">
// //                   {selInv.fee_breakdown.map((item,i)=>(
// //                     <div key={i} className="flex justify-between px-3 py-2 text-sm border-b last:border-b-0">
// //                       <span className="text-gray-600">{item.name}</span>
// //                       <span className="font-medium">{fmt(item.amount)}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //             <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
// //               <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-semibold">{fmt(selInv.total_amount)}</span></div>
// //               {selInv.discount_amount>0&&<div className="flex justify-between text-orange-600"><span>Discount</span><span>-{fmt(selInv.discount_amount)}</span></div>}
// //               <div className="flex justify-between text-green-600"><span>Paid</span><span className="font-semibold">{fmt(selInv.amount_paid)}</span></div>
// //               <div className="flex justify-between text-red-600 font-bold border-t pt-1.5"><span>Balance Due</span><span className="text-base">{fmt(selInv.balance_due)}</span></div>
// //             </div>
// //             {selInv.notes&&<div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2"><span className="text-yellow-700 font-medium">Note: </span>{selInv.notes}</div>}
// //             <div className="flex gap-3 pt-1">
// //               <Button type="button" onClick={()=>setShowView(false)} variant="outline" className="flex-1">Close</Button>
// //               <Button onClick={()=>{setShowView(false);openEdit(selInv);}} className="flex-1 bg-orange-500 hover:bg-orange-600">
// //                 <Edit size={14} className="mr-2"/> Edit Invoice
// //               </Button>
// //             </div>
// //           </div>
// //         )}
// //       </Modal>
// //     </DashboardLayout>
// //   );
// // }


// /**
//  * Invoice Management Page - Admin only
//  * Class-card view → click class → see students in that class
//  * Full invoice editing per student
//  * Fully responsive: mobile-first, tablet, desktop
//  */

// import React, { useState, useEffect, useMemo } from 'react';
// import DashboardLayout from '../../components/dashboard/DashboardLayout';
// import Alert from '../../components/common/Alert';
// import Button from '../../components/common/Button';
// import Modal from '../../components/common/modal';
// import {
//   FileText, Plus, RefreshCw, Search, CheckCircle, XCircle, Clock,
//   AlertCircle, Eye, Layers, GraduationCap,
//   ChevronLeft, Edit, Save, X, TrendingUp, Info, Filter
// } from 'lucide-react';
// import {
//   getInvoices, generateInvoice, bulkGenerateInvoices, getInvoiceById
// } from '../../services/paymentService';
// import { getAcademicSessions, getAcademicTerms, getClassLevels } from '../../services/academicService';
// import { getStudents } from '../../services/studentService';
// import { put } from '../../services/api';
// import useAuth from '../../hooks/useAuth';

// // ── helpers ───────────────────────────────────────────────────────────────────

// const fmt = (n) =>
//   new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n || 0);

// const fmtShort = (n) => {
//   if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
//   if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
//   return fmt(n);
// };

// const fmtDate = (d) => {
//   if (!d) return 'N/A';
//   return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };

// const STATUS_CFG = {
//   paid:           { bg: 'bg-green-100 text-green-800',  icon: <CheckCircle size={11}/>, label: 'Paid' },
//   pending:        { bg: 'bg-yellow-100 text-yellow-800',icon: <Clock size={11}/>,        label: 'Pending' },
//   partially_paid: { bg: 'bg-blue-100 text-blue-800',   icon: <TrendingUp size={11}/>,   label: 'Partial' },
//   overdue:        { bg: 'bg-red-100 text-red-800',      icon: <AlertCircle size={11}/>,  label: 'Overdue' },
//   cancelled:      { bg: 'bg-gray-100 text-gray-600',   icon: <XCircle size={11}/>,      label: 'Cancelled' },
// };
// const StatusBadge = ({ status }) => {
//   const c = STATUS_CFG[status] || STATUS_CFG.pending;
//   return (
//     <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${c.bg}`}>
//       {c.icon}{c.label}
//     </span>
//   );
// };

// const updateInvoice = async (id, data) => {
//   try {
//     const res = await put(`/payments/invoices/${id}/update/`, data);
//     return res.data || res;
//   } catch (err) { throw err; }
// };

// // ── Mobile Filter Sheet ─────────────────────────────────────────────────────
// const MobileFilterSheet = ({ isOpen, onClose, filterSession, setFilterSession, filterTerm, setFilterTerm, sessions, terms, onApply }) => {
//   if (!isOpen) return null;
//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
//       <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Filter Invoices</h3>
//           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
//             <X size={20} />
//           </button>
//         </div>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
//             <select 
//               value={filterSession} 
//               onChange={(e) => setFilterSession(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//             >
//               <option value="">All Sessions</option>
//               {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs font-medium text-gray-500 mb-1">Term</label>
//             <select 
//               value={filterTerm} 
//               onChange={(e) => setFilterTerm(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//             >
//               <option value="">All Terms</option>
//               {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//             </select>
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button 
//               onClick={() => { onApply(); onClose(); }} 
//               className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium"
//             >
//               Apply Filters
//             </button>
//             <button 
//               onClick={() => { setFilterSession(''); setFilterTerm(''); onApply(); onClose(); }} 
//               className="px-4 py-2.5 text-red-500 font-medium text-sm"
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// export default function InvoiceManagement() {
//   const { user } = useAuth();
//   const isAdmin = ['head','hm','principal','vice_principal','accountant'].includes(user?.role);

//   const [invoices,    setInvoices]    = useState([]);
//   const [sessions,    setSessions]    = useState([]);
//   const [terms,       setTerms]       = useState([]);
//   const [classLevels, setClassLevels] = useState([]);
//   const [students,    setStudents]    = useState([]);
//   const [loading,     setLoading]     = useState(true);
//   const [error,       setError]       = useState('');
//   const [success,     setSuccess]     = useState('');

//   // view state
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [filterSession, setFilterSession] = useState('');
//   const [filterTerm,    setFilterTerm]    = useState('');
//   const [detailSearch,  setDetailSearch]  = useState('');
//   const [detailStatus,  setDetailStatus]  = useState('');
//   const [showMobileFilter, setShowMobileFilter] = useState(false);

//   // modals
//   const [showSingle, setShowSingle] = useState(false);
//   const [showBulk,   setShowBulk]   = useState(false);
//   const [showEdit,   setShowEdit]   = useState(false);
//   const [showView,   setShowView]   = useState(false);
//   const [selInv,     setSelInv]     = useState(null);
//   const [modalLoad,  setModalLoad]  = useState(false);

//   // forms
//   const [singleForm,  setSingleForm]  = useState({ student_id:'', session_id:'', term_id:'' });
//   const [stuSearch,   setStuSearch]   = useState('');
//   const [stuSugg,     setStuSugg]     = useState([]);
//   const [bulkForm,    setBulkForm]    = useState({ session_id:'', term_id:'', class_level_id:'' });
//   const [editForm,    setEditForm]    = useState({ total_amount:'', due_date:'', notes:'', discount_amount:'0', discount_reason:'', fee_breakdown:[] });

//   // ── load ──
//   useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

//   const loadAll = async () => {
//     try {
//       setLoading(true); setError('');
//       const [invR, sesR, terR, clR, stuR] = await Promise.all([
//         getInvoices().catch(()=>[]),
//         getAcademicSessions().catch(()=>[]),
//         getAcademicTerms().catch(()=>[]),
//         getClassLevels().catch(()=>[]),
//         getStudents({ limit:1000 }).catch(()=>({ results:[] })),
//       ]);
//       setInvoices(Array.isArray(invR) ? invR : (invR?.results || invR || []));
//       setSessions(sesR?.results || sesR || []);
//       setTerms(terR?.results   || terR || []);
//       setClassLevels(clR?.results || clR || []);
//       setStudents(stuR?.results || []);
//     } catch { setError('Failed to load data.'); }
//     finally { setLoading(false); }
//   };

//   // ── student suggestions ──
//   useEffect(() => {
//     if (stuSearch.length >= 2) {
//       const q = stuSearch.toLowerCase();
//       setStuSugg(
//         students.filter(s =>
//           `${s.user?.first_name} ${s.user?.last_name}`.toLowerCase().includes(q) ||
//           s.admission_number?.toLowerCase().includes(q)
//         ).slice(0,8)
//       );
//     } else setStuSugg([]);
//   }, [stuSearch, students]);

//   // ── derived ──
//   const visible = useMemo(() => invoices.filter(inv => {
//     const okS = !filterSession || String(inv.session) === String(filterSession);
//     const okT = !filterTerm    || String(inv.term)    === String(filterTerm);
//     return okS && okT;
//   }), [invoices, filterSession, filterTerm]);

//   const classCards = useMemo(() => {
//     const map = {};
//     visible.forEach(inv => {
//       const cn = inv.class_level_name || 'Unassigned';
//       if (!map[cn]) map[cn] = { name:cn, invoices:[], paid:0, pending:0, overdue:0, partial:0, total_due:0 };
//       map[cn].invoices.push(inv);
//       if      (inv.status==='paid')           map[cn].paid++;
//       else if (inv.status==='overdue')        map[cn].overdue++;
//       else if (inv.status==='partially_paid') map[cn].partial++;
//       else                                    map[cn].pending++;
//       map[cn].total_due += parseFloat(inv.balance_due||0);
//     });
//     return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name));
//   }, [visible]);

//   const stats = useMemo(() => ({
//     total:   visible.length,
//     paid:    visible.filter(i=>i.status==='paid').length,
//     pending: visible.filter(i=>i.status==='pending'||i.status==='partially_paid').length,
//     overdue: visible.filter(i=>i.status==='overdue').length,
//   }), [visible]);

//   const classInvoices = useMemo(() => {
//     if (!selectedClass) return [];
//     return visible.filter(inv => {
//       const okCl = inv.class_level_name === selectedClass.name;
//       const okSe = !detailSearch ||
//         inv.student_name?.toLowerCase().includes(detailSearch.toLowerCase()) ||
//         inv.student_admission?.toLowerCase().includes(detailSearch.toLowerCase()) ||
//         inv.invoice_number?.toLowerCase().includes(detailSearch.toLowerCase());
//       const okSt = !detailStatus || inv.status === detailStatus;
//       return okCl && okSe && okSt;
//     });
//   }, [selectedClass, visible, detailSearch, detailStatus]);

//   // ── handlers ──
//   const handleSingle = async () => {
//     if (!singleForm.student_id||!singleForm.session_id||!singleForm.term_id) {
//       setError('Fill in all fields'); return;
//     }
//     try {
//       setModalLoad(true); setError('');
//       const res = await generateInvoice({
//         student_id: parseInt(singleForm.student_id),
//         session_id: parseInt(singleForm.session_id),
//         term_id:    parseInt(singleForm.term_id),
//       });
//       if (res.success||res.invoice) {
//         setSuccess('Invoice generated!'); setShowSingle(false);
//         setSingleForm({student_id:'',session_id:'',term_id:''}); setStuSearch('');
//         await loadAll(); setTimeout(()=>setSuccess(''),4000);
//       } else setError(res.error||'Failed');
//     } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
//     finally { setModalLoad(false); }
//   };

//   const handleBulk = async () => {
//     if (!bulkForm.session_id||!bulkForm.term_id) { setError('Select session and term'); return; }
//     try {
//       setModalLoad(true); setError('');
//       const payload = {
//         session_id: parseInt(bulkForm.session_id),
//         term_id:    parseInt(bulkForm.term_id),
//       };
//       if (bulkForm.class_level_id) payload.class_level_id = parseInt(bulkForm.class_level_id);
//       const res = await bulkGenerateInvoices(payload);
//       const created = res.generated_count ?? res.created_count ?? 0;
//       const skip    = res.errors_count ?? 0;
//       setSuccess(`Generated ${created} invoice${created!==1?'s':''}${skip>0?` · ${skip} skipped (already exist)`:''}`);
//       setShowBulk(false); setBulkForm({session_id:'',term_id:'',class_level_id:''});
//       await loadAll(); setTimeout(()=>setSuccess(''),6000);
//     } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
//     finally { setModalLoad(false); }
//   };

//   const openEdit = (inv) => {
//     setSelInv(inv);
//     setEditForm({
//       total_amount:    String(inv.total_amount||''),
//       due_date:        inv.due_date?.slice(0,10)||'',
//       notes:           inv.notes||'',
//       discount_amount: String(inv.discount_amount||'0'),
//       discount_reason: inv.discount_reason||'',
//       fee_breakdown:   inv.fee_breakdown ? JSON.parse(JSON.stringify(inv.fee_breakdown)) : [],
//     });
//     setError(''); setShowEdit(true);
//   };

//   const saveEdit = async () => {
//     if (!selInv) return;
//     try {
//       setModalLoad(true); setError('');
//       const res = await updateInvoice(selInv.id, {
//         total_amount:    parseFloat(editForm.total_amount)||0,
//         due_date:        editForm.due_date,
//         notes:           editForm.notes,
//         discount_amount: parseFloat(editForm.discount_amount)||0,
//         discount_reason: editForm.discount_reason,
//         fee_breakdown:   editForm.fee_breakdown,
//       });
//       if (res.success||res.invoice) {
//         setSuccess('Invoice updated!'); setShowEdit(false);
//         await loadAll(); setTimeout(()=>setSuccess(''),4000);
//       } else setError(res.error||'Failed');
//     } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
//     finally { setModalLoad(false); }
//   };

//   const openView = async (inv) => {
//     try { setModalLoad(true); const f=await getInvoiceById(inv.id); setSelInv(f?.data||f||inv); }
//     catch { setSelInv(inv); } finally { setModalLoad(false); setShowView(true); }
//   };

//   const addFeeItem   = () => setEditForm(p=>({...p, fee_breakdown:[...p.fee_breakdown,{name:'',amount:0}]}));
//   const removeFeeItem= (i) => setEditForm(p=>({...p, fee_breakdown:p.fee_breakdown.filter((_,ix)=>ix!==i)}));
//   const updateFeeItem= (i,field,val) => setEditForm(p=>{
//     const fb=[...p.fee_breakdown];
//     fb[i]={...fb[i],[field]:field==='amount'?parseFloat(val)||0:val};
//     const tot=fb.reduce((s,x)=>s+(parseFloat(x.amount)||0),0);
//     return {...p,fee_breakdown:fb,total_amount:String(tot)};
//   });

//   if (!isAdmin) return (
//     <DashboardLayout title="Access Denied">
//       <div className="flex items-center justify-center min-h-[60vh] px-4">
//         <div className="text-center">
//           <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="text-red-500" size={28} />
//           </div>
//           <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
//           <p className="text-gray-500 text-sm sm:text-base">Only administrators can manage invoices.</p>
//         </div>
//       </div>
//     </DashboardLayout>
//   );

//   // ── class detail ──────────────────────────────────────────────
//   const ClassDetail = () => (
//     <div className="space-y-4">
//       <div className="flex flex-col xs:flex-row xs:items-center gap-3">
//         <button 
//           onClick={()=>{setSelectedClass(null);setDetailSearch('');setDetailStatus('');}} 
//           className="flex items-center gap-1 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <ChevronLeft size={18}/>
//           <span className="text-sm font-medium text-gray-600">Back</span>
//         </button>
//         <div>
//           <h2 className="text-lg sm:text-xl font-bold text-gray-800">{selectedClass.name}</h2>
//           <p className="text-xs sm:text-sm text-gray-500">{classInvoices.length} invoice{classInvoices.length!==1?'s':''}</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
//         <div className="flex-1 relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
//           <input 
//             type="text" 
//             value={detailSearch} 
//             onChange={e=>setDetailSearch(e.target.value)}
//             placeholder="Search by name or invoice #..." 
//             className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//           />
//         </div>
//         <select 
//           value={detailStatus} 
//           onChange={e=>setDetailStatus(e.target.value)}
//           className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
//         >
//           <option value="">All Statuses</option>
//           <option value="pending">Pending</option>
//           <option value="paid">Paid</option>
//           <option value="partially_paid">Partially Paid</option>
//           <option value="overdue">Overdue</option>
//         </select>
//       </div>

//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         {classInvoices.length===0 ? (
//           <div className="text-center py-12 text-gray-400 text-sm">No invoices match your filters.</div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     {['Invoice #','Student','Total','Paid','Balance','Due Date','Status','Actions'].map(h=>(
//                       <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {classInvoices.map(inv=>(
//                     <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-3 text-xs font-mono text-blue-600 whitespace-nowrap">{inv.invoice_number}</td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="font-medium text-sm text-gray-800">{inv.student_name}</div>
//                         <div className="text-xs text-gray-400">{inv.student_admission}</div>
//                       </td>
//                       <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">{fmt(inv.total_amount)}</td>
//                       <td className="px-4 py-3 text-sm text-green-600 whitespace-nowrap">{fmt(inv.amount_paid)}</td>
//                       <td className="px-4 py-3 text-sm text-red-600 font-bold whitespace-nowrap">{fmt(inv.balance_due)}</td>
//                       <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(inv.due_date)}</td>
//                       <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={inv.status}/></td>
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="flex gap-1">
//                           <button onClick={()=>openView(inv)} title="View" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
//                             <Eye size={14}/>
//                           </button>
//                           <button onClick={()=>openEdit(inv)} title="Edit" className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
//                             <Edit size={14}/>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Cards */}
//             <div className="md:hidden divide-y divide-gray-100">
//               {classInvoices.map(inv => (
//                 <div key={inv.id} className="p-4 space-y-3">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-mono text-xs font-semibold text-blue-600">{inv.invoice_number}</p>
//                       <p className="font-medium text-gray-800 text-sm mt-0.5">{inv.student_name}</p>
//                       <p className="text-xs text-gray-400">{inv.student_admission}</p>
//                     </div>
//                     <StatusBadge status={inv.status}/>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2 text-center">
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <p className="text-[10px] text-gray-400">Total</p>
//                       <p className="text-sm font-bold text-gray-800">{fmtShort(inv.total_amount)}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <p className="text-[10px] text-gray-400">Paid</p>
//                       <p className="text-sm font-bold text-green-600">{fmtShort(inv.amount_paid)}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-2">
//                       <p className="text-[10px] text-gray-400">Balance</p>
//                       <p className="text-sm font-bold text-red-600">{fmtShort(inv.balance_due)}</p>
//                     </div>
//                   </div>
//                   <div className="flex justify-between items-center pt-1">
//                     <p className="text-xs text-gray-500">Due: {fmtDate(inv.due_date)}</p>
//                     <div className="flex gap-2">
//                       <button onClick={()=>openView(inv)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs">View</button>
//                       <button onClick={()=>openEdit(inv)} className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg text-xs">Edit</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   // ── card grid ─────────────────────────────────────────────────
//   const CardGrid = () => (
//     <div className="space-y-5 sm:space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
//         {[
//           {label:'Total Invoices',value:stats.total,  color:'bg-blue-100 text-blue-600',   icon:<FileText size={16}/>},
//           {label:'Paid',          value:stats.paid,   color:'bg-green-100 text-green-600', icon:<CheckCircle size={16}/>},
//           {label:'Pending',       value:stats.pending,color:'bg-yellow-100 text-yellow-600',icon:<Clock size={16}/>},
//           {label:'Overdue',       value:stats.overdue,color:'bg-red-100 text-red-600',     icon:<AlertCircle size={16}/>},
//         ].map(s=>(
//           <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm">
//             <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
//             <div>
//               <p className="text-xl sm:text-2xl font-bold text-gray-800">{s.value}</p>
//               <p className="text-[10px] sm:text-xs text-gray-400">{s.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Mobile Filter Button */}
//       <div className="sm:hidden">
//         <button
//           onClick={() => setShowMobileFilter(true)}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
//         >
//           <Filter size={15} /> Filter Invoices
//           {(filterSession || filterTerm) && <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full" />}
//         </button>
//       </div>

//       {/* Desktop Filters */}
//       <div className="hidden sm:flex sm:flex-wrap gap-3 items-center">
//         <select 
//           value={filterSession} 
//           onChange={e=>{setFilterSession(e.target.value);setSelectedClass(null);}}
//           className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
//         >
//           <option value="">All Sessions</option>
//           {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
//         </select>
//         <select 
//           value={filterTerm} 
//           onChange={e=>{setFilterTerm(e.target.value);setSelectedClass(null);}}
//           className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
//         >
//           <option value="">All Terms</option>
//           {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
//         </select>
//         {(filterSession || filterTerm) && (
//           <button 
//             onClick={()=>{setFilterSession('');setFilterTerm('');}} 
//             className="text-xs text-red-500 hover:text-red-600 font-medium"
//           >
//             Clear filters
//           </button>
//         )}
//       </div>

//       {/* Mobile Filter Sheet */}
//       <MobileFilterSheet 
//         isOpen={showMobileFilter}
//         onClose={() => setShowMobileFilter(false)}
//         filterSession={filterSession}
//         setFilterSession={setFilterSession}
//         filterTerm={filterTerm}
//         setFilterTerm={setFilterTerm}
//         sessions={sessions}
//         terms={terms}
//         onApply={() => setSelectedClass(null)}
//       />

//       {loading ? (
//         <div className="flex justify-center py-16"><RefreshCw className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-gray-400"/></div>
//       ) : classCards.length===0 ? (
//         <div className="bg-white rounded-xl border border-gray-100 p-10 sm:p-16 text-center shadow-sm">
//           <FileText size={40} className="mx-auto text-gray-200 mb-3 sm:w-12 sm:h-12"/>
//           <p className="text-gray-600 font-semibold mb-1 text-sm sm:text-base">No invoices generated yet</p>
//           <p className="text-gray-400 text-xs sm:text-sm mb-6">Use "Bulk Generate" to create invoices for all students at once.</p>
//           <button onClick={()=>setShowBulk(true)} className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors inline-flex items-center gap-2">
//             <Layers size={15}/> Bulk Generate
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
//           {classCards.map(card=>{
//             const tot=card.invoices.length;
//             const pct=tot>0?Math.round((card.paid/tot)*100):0;
//             return (
//               <button key={card.name} onClick={()=>setSelectedClass(card)}
//                 className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all text-left p-4 sm:p-5 group">
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
//                     <GraduationCap size={16} className="text-gray-600 sm:w-4 sm:h-4"/>
//                   </div>
//                   <span className="text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-600">{tot} student{tot!==1?'s':''}</span>
//                 </div>
//                 <p className="font-bold text-gray-800 text-sm sm:text-base mb-0.5 line-clamp-1">{card.name}</p>
//                 <p className="text-[11px] sm:text-xs text-red-500 font-medium mb-3">{fmtShort(card.total_due)} outstanding</p>
//                 <div className="mb-3">
//                   <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1"><span>Progress</span><span>{pct}%</span></div>
//                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                     <div className="h-full bg-green-500 rounded-full transition-all" style={{width:`${pct}%`}}/>
//                   </div>
//                 </div>
//                 <div className="flex flex-wrap gap-1">
//                   {card.paid    >0&&<span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">{card.paid} paid</span>}
//                   {card.pending >0&&<span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px]">{card.pending} pending</span>}
//                   {card.partial >0&&<span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">{card.partial} partial</span>}
//                   {card.overdue >0&&<span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px]">{card.overdue} overdue</span>}
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );

//   // ── render ────────────────────────────────────────────────────
//   return (
//     <DashboardLayout title="Invoice Management">
//       <div className="space-y-4 sm:space-y-6 pb-12 px-3 sm:px-0">

//         {/* top bar */}
//         <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Invoice Management</h1>
//             <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage and track student fee invoices</p>
//           </div>
//           <div className="flex items-center gap-2 flex-wrap">
//             <button onClick={()=>setShowBulk(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
//               <Layers size={14}/> Bulk
//             </button>
//             <button onClick={()=>setShowSingle(true)} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm">
//               <Plus size={14}/> Generate
//             </button>
//             <button onClick={loadAll} className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
//               <RefreshCw size={14} className={loading?'animate-spin':''}/>
//             </button>
//           </div>
//         </div>

//         {error   && <Alert type="error"   message={error}   onClose={()=>setError('')}/>}
//         {success && <Alert type="success" message={success} onClose={()=>setSuccess('')}/>}

//         {selectedClass ? <ClassDetail/> : <CardGrid/>}
//       </div>

//       {/* ══ Single generate modal ══ */}
//       <Modal isOpen={showSingle} onClose={()=>{setShowSingle(false);setStuSearch('');setSingleForm({student_id:'',session_id:'',term_id:''});setError('');}} title="Generate Invoice for One Student" size="md">
//         <div className="py-4 space-y-4">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs sm:text-sm text-yellow-800">
//             A fee structure must exist for the student's class, session, and term.
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Student *</label>
//             <input type="text" value={stuSearch} onChange={e=>{setStuSearch(e.target.value);if(!e.target.value)setSingleForm(p=>({...p,student_id:''}));}}
//               placeholder="Type student name or admission number…"
//               className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
//             {stuSugg.length>0&&(
//               <div className="border rounded-xl mt-1 max-h-44 overflow-y-auto shadow-lg bg-white relative z-20">
//                 {stuSugg.map(s=>(
//                   <button key={s.id} type="button"
//                     onClick={()=>{setSingleForm(p=>({...p,student_id:s.id}));setStuSearch(`${s.user?.first_name||''} ${s.user?.last_name||''} (${s.admission_number})`);setStuSugg([]);}}
//                     className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0 flex justify-between items-center">
//                     <span className="font-medium text-gray-800">{s.user?.first_name} {s.user?.last_name}</span>
//                     <span className="text-gray-400 text-[10px]">{s.admission_number}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//             {singleForm.student_id&&<p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11}/> Student selected</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Session *</label>
//             <select value={singleForm.session_id} onChange={e=>setSingleForm(p=>({...p,session_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
//               <option value="">Select Session</option>
//               {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Term *</label>
//             <select value={singleForm.term_id} onChange={e=>setSingleForm(p=>({...p,term_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
//               <option value="">Select Term</option>
//               {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
//             </select>
//           </div>
//           {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2"><AlertCircle size={14}/>{error}</p>}
//           <div className="flex flex-col sm:flex-row gap-3 pt-1">
//             <button type="button" onClick={()=>{setShowSingle(false);setError('');}} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">Cancel</button>
//             <button onClick={handleSingle} disabled={modalLoad} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//               {modalLoad ? <RefreshCw size={14} className="animate-spin"/> : <CheckCircle size={14}/>}
//               Generate
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* ══ Bulk modal ══ */}
//       <Modal isOpen={showBulk} onClose={()=>{setShowBulk(false);setError('');}} title="Bulk Generate Invoices" size="md">
//         <div className="py-4 space-y-4">
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-blue-800 space-y-1">
//             <p className="font-semibold">How this works:</p>
//             <p>• Generates invoices for <strong>all active students</strong> for the selected session + term.</p>
//             <p>• Students who <strong>already have an invoice</strong> are automatically skipped.</p>
//             <p>• Leave "Class Level" blank to generate for <strong>all classes at once</strong>.</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Session *</label>
//             <select value={bulkForm.session_id} onChange={e=>setBulkForm(p=>({...p,session_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
//               <option value="">Select Session</option>
//               {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Term *</label>
//             <select value={bulkForm.term_id} onChange={e=>setBulkForm(p=>({...p,term_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
//               <option value="">Select Term</option>
//               {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Class Level <span className="text-gray-400 font-normal">(optional)</span>
//             </label>
//             <select value={bulkForm.class_level_id} onChange={e=>setBulkForm(p=>({...p,class_level_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
//               <option value="">All Classes</option>
//               {classLevels.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}
//             </select>
//           </div>
//           {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2"><AlertCircle size={14}/>{error}</p>}
//           <div className="flex flex-col sm:flex-row gap-3 pt-1">
//             <button type="button" onClick={()=>{setShowBulk(false);setError('');}} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">Cancel</button>
//             <button onClick={handleBulk} disabled={modalLoad} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//               {modalLoad ? <RefreshCw size={14} className="animate-spin"/> : <Layers size={14}/>}
//               Generate Now
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* ══ Edit invoice modal ══ */}
//       <Modal isOpen={showEdit} onClose={()=>{setShowEdit(false);setError('');}} title="Edit Invoice" size="lg">
//         {selInv&&(
//           <div className="py-4 max-h-[75vh] overflow-y-auto space-y-5">
//             <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//               <div>
//                 <p className="font-semibold text-gray-800 text-sm sm:text-base">{selInv.student_name}</p>
//                 <p className="text-xs text-gray-500">{selInv.student_admission} · {selInv.class_level_name}</p>
//                 <p className="text-[10px] text-gray-400">{selInv.session_name} — {selInv.term_name}</p>
//               </div>
//               <p className="font-mono text-xs sm:text-sm text-blue-600">{selInv.invoice_number}</p>
//             </div>

//             {/* Fee breakdown editor */}
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <p className="text-sm font-semibold text-gray-700">Fee Breakdown</p>
//                 <button type="button" onClick={addFeeItem} className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1">
//                   <Plus size={12}/> Add item
//                 </button>
//               </div>
//               <div className="space-y-2 rounded-xl p-3 bg-gray-50">
//                 {editForm.fee_breakdown.length===0&&<p className="text-xs text-gray-400 text-center py-2">No items. Click "Add item".</p>}
//                 {editForm.fee_breakdown.map((item,i)=>(
//                   <div key={i} className="flex gap-2 items-center">
//                     <input type="text" value={item.name} onChange={e=>updateFeeItem(i,'name',e.target.value)}
//                       placeholder="Fee name" className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"/>
//                     <input type="number" value={item.amount} onChange={e=>updateFeeItem(i,'amount',e.target.value)}
//                       placeholder="Amount" className="w-28 sm:w-36 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"/>
//                     <button type="button" onClick={()=>removeFeeItem(i)} className="text-red-400 hover:text-red-600 p-1"><X size={14}/></button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Amount (₦)</label>
//                 <input type="number" value={editForm.total_amount} onChange={e=>setEditForm(p=>({...p,total_amount:e.target.value}))}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-gray-900"/>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
//                 <input type="date" value={editForm.due_date} onChange={e=>setEditForm(p=>({...p,due_date:e.target.value}))}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Amount (₦)</label>
//                 <input type="number" value={editForm.discount_amount} onChange={e=>setEditForm(p=>({...p,discount_amount:e.target.value}))}
//                   min="0" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Reason</label>
//                 <input type="text" value={editForm.discount_reason} onChange={e=>setEditForm(p=>({...p,discount_reason:e.target.value}))}
//                   placeholder="e.g. Scholarship"
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes / Remarks</label>
//               <textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} rows={2}
//                 className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
//                 placeholder="Any notes for this invoice…"/>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
//               <div className="flex justify-between"><span className="text-gray-500">Total:</span><span className="font-bold">{fmt(parseFloat(editForm.total_amount)||0)}</span></div>
//               <div className="flex justify-between text-orange-600"><span>Discount:</span><span>- {fmt(parseFloat(editForm.discount_amount)||0)}</span></div>
//               <div className="flex justify-between font-bold border-t pt-1 text-blue-700">
//                 <span>Net Amount:</span>
//                 <span>{fmt((parseFloat(editForm.total_amount)||0)-(parseFloat(editForm.discount_amount)||0))}</span>
//               </div>
//             </div>

//             {error&&<p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2"><AlertCircle size={14}/>{error}</p>}

//             <div className="flex flex-col sm:flex-row gap-3 pt-1">
//               <button type="button" onClick={()=>{setShowEdit(false);setError('');}} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">Cancel</button>
//               <button onClick={saveEdit} disabled={modalLoad} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//                 {modalLoad ? <RefreshCw size={14} className="animate-spin"/> : <Save size={14}/>}
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* ══ View invoice modal ══ */}
//       <Modal isOpen={showView} onClose={()=>setShowView(false)} title="Invoice Details" size="md">
//         {selInv&&(
//           <div className="py-4 space-y-4">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 rounded-xl p-4">
//               <div>
//                 <p className="text-[10px] text-gray-400">Invoice</p>
//                 <p className="font-mono font-bold text-blue-600 text-sm sm:text-base">{selInv.invoice_number}</p>
//               </div>
//               <StatusBadge status={selInv.status}/>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//               <div><p className="text-[10px] text-gray-400">Student</p><p className="font-medium text-gray-800">{selInv.student_name}</p></div>
//               <div><p className="text-[10px] text-gray-400">Admission #</p><p className="font-medium text-gray-800">{selInv.student_admission}</p></div>
//               <div><p className="text-[10px] text-gray-400">Class</p><p className="font-medium text-gray-800">{selInv.class_level_name}</p></div>
//               <div><p className="text-[10px] text-gray-400">Session · Term</p><p className="font-medium text-gray-800">{selInv.session_name} · {selInv.term_name}</p></div>
//               <div><p className="text-[10px] text-gray-400">Issue Date</p><p className="font-medium text-gray-800">{fmtDate(selInv.issue_date)}</p></div>
//               <div><p className="text-[10px] text-gray-400">Due Date</p><p className="font-medium text-gray-800">{fmtDate(selInv.due_date)}</p></div>
//             </div>
//             {selInv.fee_breakdown?.length>0&&(
//               <div>
//                 <p className="text-sm font-semibold text-gray-700 mb-2">Fee Breakdown</p>
//                 <div className="border border-gray-100 rounded-xl overflow-hidden">
//                   {selInv.fee_breakdown.map((item,i)=>(
//                     <div key={i} className="flex justify-between px-3 py-2 text-sm border-b last:border-b-0 bg-gray-50">
//                       <span className="text-gray-600">{item.name}</span>
//                       <span className="font-medium">{fmt(item.amount)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <div className="bg-gray-50 rounded-xl p-4 space-y-1.5 text-sm">
//               <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-semibold">{fmt(selInv.total_amount)}</span></div>
//               {selInv.discount_amount>0&&<div className="flex justify-between text-orange-600"><span>Discount</span><span>-{fmt(selInv.discount_amount)}</span></div>}
//               <div className="flex justify-between text-green-600"><span>Paid</span><span className="font-semibold">{fmt(selInv.amount_paid)}</span></div>
//               <div className="flex justify-between text-red-600 font-bold border-t pt-1.5"><span>Balance Due</span><span className="text-base">{fmt(selInv.balance_due)}</span></div>
//             </div>
//             {selInv.notes&&<div className="text-xs sm:text-sm bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2"><span className="text-yellow-700 font-medium">Note: </span>{selInv.notes}</div>}
//             <div className="flex flex-col sm:flex-row gap-3 pt-1">
//               <button type="button" onClick={()=>setShowView(false)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm order-2 sm:order-1">Close</button>
//               <button onClick={()=>{setShowView(false);openEdit(selInv);}} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm flex items-center justify-center gap-2 order-1 sm:order-2">
//                 <Edit size={14}/> Edit Invoice
//               </button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </DashboardLayout>
//   );
// }


/**
 * Invoice Management Page - Admin only
 * Class-card view → click class → see students in that class
 * Full invoice editing per student
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/modal';
import {
  FileText, Plus, RefreshCw, Search, CheckCircle, XCircle, Clock,
  AlertCircle, Eye, Layers, GraduationCap,
  ChevronLeft, Edit, Save, X, TrendingUp, Info, Filter,
  ChevronRight, Grid3x3, Table2
} from 'lucide-react';
import {
  getInvoices, generateInvoice, bulkGenerateInvoices, getInvoiceById
} from '../../services/paymentService';
import { getAcademicSessions, getAcademicTerms, getClassLevels } from '../../services/academicService';
import { getStudents } from '../../services/studentService';
import { put } from '../../services/api';
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
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
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

// Status Badge
const STATUS_CFG = {
  paid:           { bg: 'bg-green-100 text-green-700',  icon: <CheckCircle size={10}/>, label: 'Paid' },
  pending:        { bg: 'bg-yellow-100 text-yellow-700', icon: <Clock size={10}/>,        label: 'Pending' },
  partially_paid: { bg: 'bg-blue-100 text-blue-700',   icon: <TrendingUp size={10}/>,   label: 'Partial' },
  overdue:        { bg: 'bg-red-100 text-red-700',      icon: <AlertCircle size={10}/>,  label: 'Overdue' },
  cancelled:      { bg: 'bg-gray-100 text-gray-600',   icon: <XCircle size={10}/>,      label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium ${c.bg}`}>
      {c.icon}{c.label}
    </span>
  );
};

// Stat Card
const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <Card className={`p-3 ${bgColor}`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} bg-opacity-20`}>
        <Icon size={14} className={`${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <Text variant="h4" className="font-bold text-gray-800">{value}</Text>
        <Text variant="tiny" className="text-gray-400">{title}</Text>
      </div>
    </div>
  </Card>
);

// Mobile Filter Sheet
const MobileFilterSheet = ({ isOpen, onClose, filterSession, setFilterSession, filterTerm, setFilterTerm, sessions, terms, onApply }) => {
  const [localSession, setLocalSession] = useState(filterSession);
  const [localTerm, setLocalTerm] = useState(filterTerm);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-5 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <Text variant="h4" className="font-semibold">Filter Invoices</Text>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Session</label>
            <select 
              value={localSession} 
              onChange={(e) => setLocalSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            >
              <option value="">All Sessions</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Term</label>
            <select 
              value={localTerm} 
              onChange={(e) => setLocalTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
            >
              <option value="">All Terms</option>
              {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              variant="primary" 
              size="medium"
              onClick={() => { setFilterSession(localSession); setFilterTerm(localTerm); onApply(); onClose(); }} 
              className="flex-1"
            >
              Apply Filters
            </Button>
            <button 
              onClick={() => { setLocalSession(''); setLocalTerm(''); setFilterSession(''); setFilterTerm(''); onApply(); onClose(); }} 
              className="px-4 py-2 text-red-500 font-medium text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100 sticky bottom-0 bg-white z-10">
      <Button variant="ghost" size="tiny" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft size={14} /> Prev
      </Button>
      <div className="flex gap-1">
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={idx} className="px-2 py-1 text-xs text-gray-400">...</span>
          ) : (
            <button key={idx} onClick={() => onPageChange(page)} className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page ? 'bg-[#D94801] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {page}
            </button>
          )
        ))}
      </div>
      <Button variant="ghost" size="tiny" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next <ChevronRight size={14} />
      </Button>
    </div>
  );
};

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n || 0);

const fmtShort = (n) => {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return fmt(n);
};

const fmtDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const updateInvoice = async (id, data) => {
  try {
    const res = await put(`/payments/invoices/${id}/update/`, data);
    return res.data || res;
  } catch (err) { throw err; }
};

// ─────────────────────────────────────────────────────────────────────────────
export default function InvoiceManagement() {
  const { user } = useAuth();
  const isAdmin = ['head','hm','principal','vice_principal','accountant'].includes(user?.role);

  const [invoices,    setInvoices]    = useState([]);
  const [sessions,    setSessions]    = useState([]);
  const [terms,       setTerms]       = useState([]);
  const [classLevels, setClassLevels] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');

  // view state
  const [selectedClass, setSelectedClass] = useState(null);
  const [filterSession, setFilterSession] = useState('');
  const [filterTerm,    setFilterTerm]    = useState('');
  const [detailSearch,  setDetailSearch]  = useState('');
  const [detailStatus,  setDetailStatus]  = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // modals
  const [showSingle, setShowSingle] = useState(false);
  const [showBulk,   setShowBulk]   = useState(false);
  const [showEdit,   setShowEdit]   = useState(false);
  const [showView,   setShowView]   = useState(false);
  const [selInv,     setSelInv]     = useState(null);
  const [modalLoad,  setModalLoad]  = useState(false);

  // forms
  const [singleForm,  setSingleForm]  = useState({ student_id:'', session_id:'', term_id:'' });
  const [stuSearch,   setStuSearch]   = useState('');
  const [stuSugg,     setStuSugg]     = useState([]);
  const [bulkForm,    setBulkForm]    = useState({ session_id:'', term_id:'', class_level_id:'' });
  const [editForm,    setEditForm]    = useState({ total_amount:'', due_date:'', notes:'', discount_amount:'0', discount_reason:'', fee_breakdown:[] });

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── load ──
  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

  const loadAll = async () => {
    try {
      setLoading(true); setError('');
      const [invR, sesR, terR, clR, stuR] = await Promise.all([
        getInvoices().catch(()=>[]),
        getAcademicSessions().catch(()=>[]),
        getAcademicTerms().catch(()=>[]),
        getClassLevels().catch(()=>[]),
        getStudents({ limit:1000 }).catch(()=>({ results:[] })),
      ]);
      setInvoices(Array.isArray(invR) ? invR : (invR?.results || invR || []));
      setSessions(sesR?.results || sesR || []);
      setTerms(terR?.results   || terR || []);
      setClassLevels(clR?.results || clR || []);
      setStudents(stuR?.results || []);
      setCurrentPage(1);
    } catch { setError('Failed to load data.'); }
    finally { setLoading(false); }
  };

  // ── student suggestions ──
  useEffect(() => {
    if (stuSearch.length >= 2) {
      const q = stuSearch.toLowerCase();
      setStuSugg(
        students.filter(s =>
          `${s.user?.first_name} ${s.user?.last_name}`.toLowerCase().includes(q) ||
          s.admission_number?.toLowerCase().includes(q)
        ).slice(0,8)
      );
    } else setStuSugg([]);
  }, [stuSearch, students]);

  // ── derived ──
  const visible = useMemo(() => invoices.filter(inv => {
    const okS = !filterSession || String(inv.session) === String(filterSession);
    const okT = !filterTerm    || String(inv.term)    === String(filterTerm);
    return okS && okT;
  }), [invoices, filterSession, filterTerm]);

  const classCards = useMemo(() => {
    const map = {};
    visible.forEach(inv => {
      const cn = inv.class_level_name || 'Unassigned';
      if (!map[cn]) map[cn] = { name:cn, invoices:[], paid:0, pending:0, overdue:0, partial:0, total_due:0 };
      map[cn].invoices.push(inv);
      if      (inv.status==='paid')           map[cn].paid++;
      else if (inv.status==='overdue')        map[cn].overdue++;
      else if (inv.status==='partially_paid') map[cn].partial++;
      else                                    map[cn].pending++;
      map[cn].total_due += parseFloat(inv.balance_due||0);
    });
    return Object.values(map).sort((a,b)=>a.name.localeCompare(b.name));
  }, [visible]);

  const stats = useMemo(() => ({
    total:   visible.length,
    paid:    visible.filter(i=>i.status==='paid').length,
    pending: visible.filter(i=>i.status==='pending'||i.status==='partially_paid').length,
    overdue: visible.filter(i=>i.status==='overdue').length,
  }), [visible]);

  const classInvoices = useMemo(() => {
    if (!selectedClass) return [];
    return visible.filter(inv => {
      const okCl = inv.class_level_name === selectedClass.name;
      const okSe = !detailSearch ||
        inv.student_name?.toLowerCase().includes(detailSearch.toLowerCase()) ||
        inv.student_admission?.toLowerCase().includes(detailSearch.toLowerCase()) ||
        inv.invoice_number?.toLowerCase().includes(detailSearch.toLowerCase());
      const okSt = !detailStatus || inv.status === detailStatus;
      return okCl && okSe && okSt;
    });
  }, [selectedClass, visible, detailSearch, detailStatus]);

  // Pagination for class invoices
  const totalPages = Math.ceil(classInvoices.length / itemsPerPage);
  const paginatedInvoices = classInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset pagination when class changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, detailSearch, detailStatus]);

  // ── handlers ──
  const handleSingle = async () => {
    if (!singleForm.student_id||!singleForm.session_id||!singleForm.term_id) {
      setError('Fill in all fields'); return;
    }
    try {
      setModalLoad(true); setError('');
      const res = await generateInvoice({
        student_id: parseInt(singleForm.student_id),
        session_id: parseInt(singleForm.session_id),
        term_id:    parseInt(singleForm.term_id),
      });
      if (res.success||res.invoice) {
        setSuccess('Invoice generated!'); setShowSingle(false);
        setSingleForm({student_id:'',session_id:'',term_id:''}); setStuSearch('');
        await loadAll(); setTimeout(()=>setSuccess(''),4000);
      } else setError(res.error||'Failed');
    } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
    finally { setModalLoad(false); }
  };

  const handleBulk = async () => {
    if (!bulkForm.session_id||!bulkForm.term_id) { setError('Select session and term'); return; }
    try {
      setModalLoad(true); setError('');
      const payload = {
        session_id: parseInt(bulkForm.session_id),
        term_id:    parseInt(bulkForm.term_id),
      };
      if (bulkForm.class_level_id) payload.class_level_id = parseInt(bulkForm.class_level_id);
      const res = await bulkGenerateInvoices(payload);
      const created = res.generated_count ?? res.created_count ?? 0;
      const skip    = res.errors_count ?? 0;
      setSuccess(`Generated ${created} invoice${created!==1?'s':''}${skip>0?` · ${skip} skipped (already exist)`:''}`);
      setShowBulk(false); setBulkForm({session_id:'',term_id:'',class_level_id:''});
      await loadAll(); setTimeout(()=>setSuccess(''),6000);
    } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
    finally { setModalLoad(false); }
  };

  const openEdit = (inv) => {
    setSelInv(inv);
    setEditForm({
      total_amount:    String(inv.total_amount||''),
      due_date:        inv.due_date?.slice(0,10)||'',
      notes:           inv.notes||'',
      discount_amount: String(inv.discount_amount||'0'),
      discount_reason: inv.discount_reason||'',
      fee_breakdown:   inv.fee_breakdown ? JSON.parse(JSON.stringify(inv.fee_breakdown)) : [],
    });
    setError(''); setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!selInv) return;
    try {
      setModalLoad(true); setError('');
      const res = await updateInvoice(selInv.id, {
        total_amount:    parseFloat(editForm.total_amount)||0,
        due_date:        editForm.due_date,
        notes:           editForm.notes,
        discount_amount: parseFloat(editForm.discount_amount)||0,
        discount_reason: editForm.discount_reason,
        fee_breakdown:   editForm.fee_breakdown,
      });
      if (res.success||res.invoice) {
        setSuccess('Invoice updated!'); setShowEdit(false);
        await loadAll(); setTimeout(()=>setSuccess(''),4000);
      } else setError(res.error||'Failed');
    } catch(e) { setError(e.response?.data?.error||e.message||'Failed'); }
    finally { setModalLoad(false); }
  };

  const openView = async (inv) => {
    try { setModalLoad(true); const f=await getInvoiceById(inv.id); setSelInv(f?.data||f||inv); }
    catch { setSelInv(inv); } finally { setModalLoad(false); setShowView(true); }
  };

  const addFeeItem   = () => setEditForm(p=>({...p, fee_breakdown:[...p.fee_breakdown,{name:'',amount:0}]}));
  const removeFeeItem= (i) => setEditForm(p=>({...p, fee_breakdown:p.fee_breakdown.filter((_,ix)=>ix!==i)}));
  const updateFeeItem= (i,field,val) => setEditForm(p=>{
    const fb=[...p.fee_breakdown];
    fb[i]={...fb[i],[field]:field==='amount'?parseFloat(val)||0:val};
    const tot=fb.reduce((s,x)=>s+(parseFloat(x.amount)||0),0);
    return {...p,fee_breakdown:fb,total_amount:String(tot)};
  });

  const hasActiveFilters = filterSession || filterTerm;

  if (!isAdmin) return (
    <DashboardLayout title="Access Denied">
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={28} />
          </div>
          <Text variant="h3" className="font-bold text-gray-800 mb-2">Access Denied</Text>
          <Text variant="body" className="text-gray-500">Only administrators can manage invoices.</Text>
        </div>
      </div>
    </DashboardLayout>
  );

  // ── class detail ──────────────────────────────────────────────
  const ClassDetail = () => (
    <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
      <Card className="overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="flex flex-col xs:flex-row xs:items-center gap-3">
            <button 
              onClick={()=>{setSelectedClass(null);setDetailSearch('');setDetailStatus('');setCurrentPage(1);}} 
              className="flex items-center gap-1 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={18}/>
              <span className="text-sm font-medium text-gray-600">Back</span>
            </button>
            <div>
              <Text variant="h3" className="font-bold text-gray-800">{selectedClass.name}</Text>
              <Text variant="tiny" className="text-gray-500">{classInvoices.length} invoice{classInvoices.length!==1?'s':''}</Text>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
              <input 
                type="text" 
                value={detailSearch} 
                onChange={e=>{setDetailSearch(e.target.value); setCurrentPage(1);}}
                placeholder="Search by name or invoice #..." 
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
              />
            </div>
            <select 
              value={detailStatus} 
              onChange={e=>{setDetailStatus(e.target.value); setCurrentPage(1);}}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] bg-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {classInvoices.length===0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No invoices match your filters.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Paid</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Due Date</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedInvoices.map(inv=>(
                      <tr key={inv.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3">
                          <Text variant="tiny" className="font-mono text-blue-600">{inv.invoice_number}</Text>
                         </td>
                        <td className="px-4 py-3">
                          <div>
                            <Text variant="small" className="font-medium text-gray-800">{inv.student_name}</Text>
                            <Text variant="tiny" className="text-gray-400">{inv.student_admission}</Text>
                          </div>
                         </td>
                        <td className="px-4 py-3">
                          <Text variant="small" className="font-semibold text-gray-800">{fmt(inv.total_amount)}</Text>
                         </td>
                        <td className="px-4 py-3">
                          <Text variant="small" className="text-green-600">{fmt(inv.amount_paid)}</Text>
                         </td>
                        <td className="px-4 py-3">
                          <Text variant="small" className="font-bold text-red-600">{fmt(inv.balance_due)}</Text>
                         </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Text variant="tiny" className="text-gray-500">{fmtDate(inv.due_date)}</Text>
                         </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={inv.status}/>
                         </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={()=>openView(inv)} title="View" className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye size={14}/>
                            </button>
                            <button onClick={()=>openEdit(inv)} title="Edit" className="p-1.5 text-gray-500 hover:text-[#D94801] hover:bg-orange-50 rounded-lg transition-colors">
                              <Edit size={14}/>
                            </button>
                          </div>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {paginatedInvoices.map(inv => (
                  <Card key={inv.id} className="p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text variant="tiny" className="font-mono font-semibold text-blue-600">{inv.invoice_number}</Text>
                        <Text variant="small" className="font-medium text-gray-800 mt-0.5">{inv.student_name}</Text>
                        <Text variant="tiny" className="text-gray-400">{inv.student_admission}</Text>
                      </div>
                      <StatusBadge status={inv.status}/>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <Text variant="tiny" className="text-gray-400">Total</Text>
                        <Text variant="small" className="font-bold text-gray-800">{fmtShort(inv.total_amount)}</Text>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <Text variant="tiny" className="text-gray-400">Paid</Text>
                        <Text variant="small" className="font-bold text-green-600">{fmtShort(inv.amount_paid)}</Text>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <Text variant="tiny" className="text-gray-400">Balance</Text>
                        <Text variant="small" className="font-bold text-red-600">{fmtShort(inv.balance_due)}</Text>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <Text variant="tiny" className="text-gray-500">Due: {fmtDate(inv.due_date)}</Text>
                      <div className="flex gap-2">
                        <button onClick={()=>openView(inv)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg text-xs">View</button>
                        <button onClick={()=>openEdit(inv)} className="p-1.5 text-[#D94801] hover:bg-orange-50 rounded-lg text-xs">Edit</button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
              
              {/* Showing info */}
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <Text variant="caption" className="text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, classInvoices.length)} of {classInvoices.length} invoices
                </Text>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );

  // ── card grid ─────────────────────────────────────────────────
  const CardGrid = () => (
    <div className="flex-1 overflow-y-auto min-h-0 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pb-4">
      <div className="space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <StatCard title="Total Invoices" value={stats.total} icon={FileText} color="bg-blue-100" bgColor="border-gray-100" />
          <StatCard title="Paid" value={stats.paid} icon={CheckCircle} color="bg-green-100" bgColor="border-gray-100" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-100" bgColor="border-gray-100" />
          <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} color="bg-red-100" bgColor="border-gray-100" />
        </div>

        {/* Mobile Filter Button */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Filter size={15} /> Filter Invoices
            {hasActiveFilters && <span className="w-2 h-2 bg-[#D94801] rounded-full" />}
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex sm:flex-wrap gap-3 items-center">
          <select 
            value={filterSession} 
            onChange={e=>{setFilterSession(e.target.value);setSelectedClass(null);}}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            <option value="">All Sessions</option>
            {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select 
            value={filterTerm} 
            onChange={e=>{setFilterTerm(e.target.value);setSelectedClass(null);}}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D94801]"
          >
            <option value="">All Terms</option>
            {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {hasActiveFilters && (
            <button 
              onClick={()=>{setFilterSession('');setFilterTerm('');}} 
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        <MobileFilterSheet 
          isOpen={showMobileFilter}
          onClose={() => setShowMobileFilter(false)}
          filterSession={filterSession}
          setFilterSession={setFilterSession}
          filterTerm={filterTerm}
          setFilterTerm={setFilterTerm}
          sessions={sessions}
          terms={terms}
          onApply={() => setSelectedClass(null)}
        />

        {loading ? (
          <div className="flex justify-center py-16"><RefreshCw className="animate-spin h-8 w-8 text-[#D94801]"/></div>
        ) : classCards.length===0 ? (
          <Card className="p-10 sm:p-16 text-center shadow-sm">
            <FileText size={40} className="mx-auto text-gray-200 mb-3"/>
            <Text variant="body" className="text-gray-600 font-semibold mb-1">No invoices generated yet</Text>
            <Text variant="caption" className="text-gray-400 mb-6">Use "Bulk Generate" to create invoices for all students at once.</Text>
            <Button variant="primary" size="small" onClick={()=>setShowBulk(true)} icon={Layers}>
              Bulk Generate
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {classCards.map(card=>{
              const tot=card.invoices.length;
              const pct=tot>0?Math.round((card.paid/tot)*100):0;
              return (
                <button key={card.name} onClick={()=>setSelectedClass(card)}
                  className="bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all text-left p-4 sm:p-5 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <GraduationCap size={16} className="text-gray-600"/>
                    </div>
                    <Text variant="tiny" className="text-gray-400 group-hover:text-gray-600">{tot} student{tot!==1?'s':''}</Text>
                  </div>
                  <Text variant="small" className="font-bold text-gray-800 mb-0.5 line-clamp-1">{card.name}</Text>
                  <Text variant="tiny" className="text-red-500 font-medium mb-3">{fmtShort(card.total_due)} outstanding</Text>
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>Progress</span><span>{pct}%</span></div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{width:`${pct}%`}}/>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.paid    >0&&<span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[9px]">{card.paid} paid</span>}
                    {card.pending >0&&<span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px]">{card.pending} pending</span>}
                    {card.partial >0&&<span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px]">{card.partial} partial</span>}
                    {card.overdue >0&&<span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px]">{card.overdue} overdue</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ── render ────────────────────────────────────────────────────
  return (
    <DashboardLayout title="Invoice Management">
      {/* Fixed height container with internal scrolling - only table/card scrolls */}
      <div className="h-[calc(100vh-120px)] flex flex-col px-3 sm:px-4 lg:px-6">
        
        {/* STICKY HEADER SECTION */}
        <div className="sticky top-0 z-20 bg-gray-50 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 pt-4 pb-2">
          {/* top bar */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1D2B49] rounded-xl flex items-center justify-center shadow-sm">
                  <FileText size={14} className="text-white" />
                </div>
                <Text variant="h2" className="font-bold">Invoice Management</Text>
              </div>
              <Text variant="caption" className="text-gray-400 pl-9">
                Manage and track student fee invoices • {invoices.length} total invoices
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="small" icon={Layers} onClick={()=>setShowBulk(true)}>
                Bulk
              </Button>
              <Button variant="primary" size="small" icon={Plus} onClick={()=>setShowSingle(true)}>
                Generate
              </Button>
              <Button variant="outline" size="small" icon={RefreshCw} onClick={loadAll} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>

          {error && <Alert type="error" message={error} onClose={()=>setError('')} />}
          {success && <Alert type="success" message={success} onClose={()=>setSuccess('')} />}
        </div>

        {selectedClass ? <ClassDetail/> : <CardGrid/>}
      </div>

      {/* ══ Single generate modal ══ */}
      <Modal isOpen={showSingle} onClose={()=>{setShowSingle(false);setStuSearch('');setSingleForm({student_id:'',session_id:'',term_id:''});setError('');}} title="Generate Invoice for One Student" size="md">
        <div className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <Text variant="tiny" className="text-yellow-800">
              A fee structure must exist for the student's class, session, and term.
            </Text>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Student *</label>
            <input type="text" value={stuSearch} onChange={e=>{setStuSearch(e.target.value);if(!e.target.value)setSingleForm(p=>({...p,student_id:''}));}}
              placeholder="Type student name or admission number…"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"/>
            {stuSugg.length>0&&(
              <div className="border rounded-xl mt-1 max-h-44 overflow-y-auto shadow-lg bg-white relative z-20">
                {stuSugg.map(s=>(
                  <button key={s.id} type="button"
                    onClick={()=>{setSingleForm(p=>({...p,student_id:s.id}));setStuSearch(`${s.user?.first_name||''} ${s.user?.last_name||''} (${s.admission_number})`);setStuSugg([]);}}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{s.user?.first_name} {s.user?.last_name}</span>
                    <span className="text-gray-400 text-[10px]">{s.admission_number}</span>
                  </button>
                ))}
              </div>
            )}
            {singleForm.student_id&&<Text variant="tiny" className="text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11}/> Student selected</Text>}
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Session *</label>
            <select value={singleForm.session_id} onChange={e=>setSingleForm(p=>({...p,session_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">Select Session</option>
              {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Term *</label>
            <select value={singleForm.term_id} onChange={e=>setSingleForm(p=>({...p,term_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">Select Term</option>
              {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={()=>{setShowSingle(false);setError('');}} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleSingle} disabled={modalLoad} className="flex-1">
              {modalLoad ? <RefreshCw size={14} className="animate-spin"/> : <CheckCircle size={14}/>}
              Generate
            </Button>
          </div>
        </div>
      </Modal>

      {/* ══ Bulk modal ══ */}
      <Modal isOpen={showBulk} onClose={()=>{setShowBulk(false);setError('');}} title="Bulk Generate Invoices" size="md">
        <div className="py-3 space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <Text variant="tiny" className="text-blue-800 font-semibold mb-1">How this works:</Text>
            <Text variant="tiny" className="text-blue-800">• Generates invoices for <strong>all active students</strong> for the selected session + term.</Text>
            <Text variant="tiny" className="text-blue-800">• Students who <strong>already have an invoice</strong> are automatically skipped.</Text>
            <Text variant="tiny" className="text-blue-800">• Leave "Class Level" blank to generate for <strong>all classes at once</strong>.</Text>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Session *</label>
            <select value={bulkForm.session_id} onChange={e=>setBulkForm(p=>({...p,session_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">Select Session</option>
              {sessions.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">Term *</label>
            <select value={bulkForm.term_id} onChange={e=>setBulkForm(p=>({...p,term_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">Select Term</option>
              {terms.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-500 mb-1">
              Class Level <span className="text-gray-400">(optional)</span>
            </label>
            <select value={bulkForm.class_level_id} onChange={e=>setBulkForm(p=>({...p,class_level_id:e.target.value}))} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]">
              <option value="">All Classes</option>
              {classLevels.map(cl=><option key={cl.id} value={cl.id}>{cl.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={()=>{setShowBulk(false);setError('');}} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleBulk} disabled={modalLoad} className="flex-1">
              {modalLoad ? <RefreshCw size={14} className="animate-spin"/> : <Layers size={14}/>}
              Generate Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* ══ Edit invoice modal ══ */}
      <Modal isOpen={showEdit} onClose={()=>{setShowEdit(false);setError('');}} title="Edit Invoice" size="lg">
        {selInv&&(
          <div className="py-3 max-h-[75vh] overflow-y-auto space-y-4 px-1">
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <Text variant="small" className="font-semibold text-gray-800">{selInv.student_name}</Text>
                <Text variant="tiny" className="text-gray-500">{selInv.student_admission} · {selInv.class_level_name}</Text>
                <Text variant="tiny" className="text-gray-400">{selInv.session_name} — {selInv.term_name}</Text>
              </div>
              <Text variant="tiny" className="font-mono text-blue-600">{selInv.invoice_number}</Text>
            </div>

            {/* Fee breakdown editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text variant="caption" className="font-semibold text-gray-700">Fee Breakdown</Text>
                <button type="button" onClick={addFeeItem} className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1">
                  <Plus size={12}/> Add item
                </button>
              </div>
              <div className="space-y-2 rounded-xl p-3 bg-gray-50">
                {editForm.fee_breakdown.length===0&&<Text variant="tiny" className="text-gray-400 text-center py-2">No items. Click "Add item".</Text>}
                {editForm.fee_breakdown.map((item,i)=>(
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={item.name} onChange={e=>updateFeeItem(i,'name',e.target.value)}
                      placeholder="Fee name" className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D94801]"/>
                    <input type="number" value={item.amount} onChange={e=>updateFeeItem(i,'amount',e.target.value)}
                      placeholder="Amount" className="w-28 sm:w-36 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D94801]"/>
                    <button type="button" onClick={()=>removeFeeItem(i)} className="text-red-400 hover:text-red-600 p-1"><X size={14}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Total Amount (₦)</label>
                <input type="number" value={editForm.total_amount} onChange={e=>setEditForm(p=>({...p,total_amount:e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#D94801]"/>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Due Date</label>
                <input type="date" value={editForm.due_date} onChange={e=>setEditForm(p=>({...p,due_date:e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"/>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Discount Amount (₦)</label>
                <input type="number" value={editForm.discount_amount} onChange={e=>setEditForm(p=>({...p,discount_amount:e.target.value}))}
                  min="0" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"/>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-500 mb-1">Discount Reason</label>
                <input type="text" value={editForm.discount_reason} onChange={e=>setEditForm(p=>({...p,discount_reason:e.target.value}))}
                  placeholder="e.g. Scholarship"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"/>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-gray-500 mb-1">Notes / Remarks</label>
              <textarea value={editForm.notes} onChange={e=>setEditForm(p=>({...p,notes:e.target.value}))} rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801]"
                placeholder="Any notes for this invoice…"/>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Total:</Text><Text variant="small" className="font-bold">{fmt(parseFloat(editForm.total_amount)||0)}</Text></div>
              <div className="flex justify-between text-[#D94801]"><Text variant="tiny">Discount:</Text><Text variant="small">- {fmt(parseFloat(editForm.discount_amount)||0)}</Text></div>
              <div className="flex justify-between font-bold border-t pt-1 text-blue-700">
                <Text variant="small">Net Amount:</Text>
                <Text variant="small">{fmt((parseFloat(editForm.total_amount)||0)-(parseFloat(editForm.discount_amount)||0))}</Text>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={()=>{setShowEdit(false);setError('');}} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={saveEdit} disabled={modalLoad} className="flex-1">
                {modalLoad ? <RefreshCw size={14} className="animate-spin"/> : <Save size={14}/>}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ══ View invoice modal ══ */}
      <Modal isOpen={showView} onClose={()=>setShowView(false)} title="Invoice Details" size="md">
        {selInv&&(
          <div className="py-3 space-y-4 max-h-[75vh] overflow-y-auto px-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-gray-50 rounded-xl p-4">
              <div>
                <Text variant="tiny" className="text-gray-400">Invoice</Text>
                <Text variant="small" className="font-mono font-bold text-blue-600">{selInv.invoice_number}</Text>
              </div>
              <StatusBadge status={selInv.status}/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><Text variant="tiny" className="text-gray-400">Student</Text><Text variant="small" className="font-medium text-gray-800">{selInv.student_name}</Text></div>
              <div><Text variant="tiny" className="text-gray-400">Admission #</Text><Text variant="small" className="font-medium text-gray-800">{selInv.student_admission}</Text></div>
              <div><Text variant="tiny" className="text-gray-400">Class</Text><Text variant="small" className="font-medium text-gray-800">{selInv.class_level_name}</Text></div>
              <div><Text variant="tiny" className="text-gray-400">Session · Term</Text><Text variant="small" className="font-medium text-gray-800">{selInv.session_name} · {selInv.term_name}</Text></div>
              <div><Text variant="tiny" className="text-gray-400">Issue Date</Text><Text variant="small" className="font-medium text-gray-800">{fmtDate(selInv.issue_date)}</Text></div>
              <div><Text variant="tiny" className="text-gray-400">Due Date</Text><Text variant="small" className="font-medium text-gray-800">{fmtDate(selInv.due_date)}</Text></div>
            </div>
            {selInv.fee_breakdown?.length>0&&(
              <div>
                <Text variant="caption" className="font-semibold text-gray-700 mb-2 block">Fee Breakdown</Text>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  {selInv.fee_breakdown.map((item,i)=>(
                    <div key={i} className="flex justify-between px-3 py-2 text-sm border-b last:border-b-0 bg-gray-50">
                      <Text variant="tiny" className="text-gray-600">{item.name}</Text>
                      <Text variant="tiny" className="font-medium">{fmt(item.amount)}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
              <div className="flex justify-between"><Text variant="tiny" className="text-gray-500">Total</Text><Text variant="small" className="font-semibold">{fmt(selInv.total_amount)}</Text></div>
              {selInv.discount_amount>0&&<div className="flex justify-between text-[#D94801]"><Text variant="tiny">Discount</Text><Text variant="small">-{fmt(selInv.discount_amount)}</Text></div>}
              <div className="flex justify-between text-green-600"><Text variant="tiny">Paid</Text><Text variant="small" className="font-semibold">{fmt(selInv.amount_paid)}</Text></div>
              <div className="flex justify-between text-red-600 font-bold border-t pt-1.5"><Text variant="small">Balance Due</Text><Text variant="body" className="font-bold">{fmt(selInv.balance_due)}</Text></div>
            </div>
            {selInv.notes&&<div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2"><Text variant="tiny" className="text-yellow-700 font-medium">Note: </Text><Text variant="tiny" className="text-yellow-700">{selInv.notes}</Text></div>}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={()=>setShowView(false)} className="flex-1">Close</Button>
              <Button variant="primary" onClick={()=>{setShowView(false);openEdit(selInv);}} className="flex-1">
                <Edit size={14}/> Edit Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}