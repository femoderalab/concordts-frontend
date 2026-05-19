// Add to imports
import { CreditCard, Wallet, History } from 'lucide-react';
import ParentBulkPayment from '../../components/payments/ParentBulkPayment';
import { getMyInvoices, getPaymentHistory } from '../../services/paymentService';

// Add to states
const [invoices, setInvoices] = useState([]);
const [payments, setPayments] = useState([]);

// Add to loadDashboard function
const loadDashboard = async () => {
  try {
    setLoading(true);
    const data = await getParentPortalDashboard();
    const invoicesRes = await getMyInvoices();
    const paymentsRes = await getPaymentHistory({ limit: 20 });
    
    setDashboard(data);
    setInvoices(invoicesRes?.results || invoicesRes || []);
    setPayments(paymentsRes?.results || paymentsRes || []);
  } catch (err) {
    console.error('Failed to load dashboard:', err);
    setError('Failed to load dashboard. Please refresh the page.');
  } finally {
    setLoading(false);
  }
};

// Add payment tab to tabs
<button onClick={() => setActiveTab('payments')} className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'payments' ? 'text-secondary-600 border-b-2 border-secondary-600' : 'text-gray-500 hover:text-gray-700'}`}>
  <CreditCard size={14} className="inline mr-2" /> Payments ({invoices.length})
</button>

// Add payments tab content
{activeTab === 'payments' && (
  <div className="space-y-6">
    <ParentBulkPayment childrenList={children} invoices={invoices} onPaymentComplete={() => loadDashboard()} />
    
    {/* Invoices Section */}
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Wallet size={16} /> Outstanding Invoices</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {invoices.filter(inv => inv.status !== 'paid').length === 0 ? (
          <div className="p-8 text-center text-gray-500">No outstanding invoices</div>
        ) : (
          invoices.filter(inv => inv.status !== 'paid').map(invoice => (
            <div key={invoice.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div><p className="font-medium text-gray-800">{invoice.student_name}</p><p className="text-xs text-gray-500">Amount: ₦{invoice.balance_due.toLocaleString()}</p></div>
              <Button onClick={() => {/* Open payment modal */}} className="bg-secondary-600 hover:bg-secondary-700 text-white text-sm">Pay Now</Button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}