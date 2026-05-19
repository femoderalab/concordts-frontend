// /**
//  * Payment Callback Page
//  * Handles Paystack redirect after payment
//  * Shows success/failed/pending status and redirects to dashboard
//  */

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
// import { verifyPayment } from '../../services/paymentService';
// import useAuth from '../../hooks/useAuth';

// const PaymentCallback = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { user } = useAuth();
//   const [status, setStatus] = useState('verifying'); // verifying | success | failed | pending
//   const [message, setMessage] = useState('');
//   const [countdown, setCountdown] = useState(5);

//   const reference = searchParams.get('reference') || searchParams.get('trxref');

//   useEffect(() => {
//     if (reference) {
//       verifyTransaction();
//     } else {
//       setStatus('failed');
//       setMessage('No payment reference found. Please contact support.');
//     }
//   }, [reference]);

//   useEffect(() => {
//     if (status === 'success' || status === 'failed' || status === 'pending') {
//       const timer = setInterval(() => {
//         setCountdown(prev => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             redirectToDashboard();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [status]);

//   const verifyTransaction = async () => {
//     try {
//       setStatus('verifying');
//       const result = await verifyPayment(reference);
//       if (result.success) {
//         setStatus('success');
//         setMessage('Your payment was successful! Your invoice has been updated.');
//       } else {
//         setStatus('failed');
//         setMessage(result.error || 'Payment could not be verified. Please contact support.');
//       }
//     } catch (err) {
//       setStatus('failed');
//       setMessage(err.message || 'Payment verification failed. Please contact support.');
//     }
//   };

//   const redirectToDashboard = () => {
//     if (user?.role === 'parent') {
//       navigate('/parent-portal');
//     } else if (user?.role === 'student') {
//       navigate('/payments');
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   const cfg = {
//     verifying: {
//       icon: <Loader2 size={64} className="text-blue-500 animate-spin" />,
//       title: 'Verifying Payment...',
//       subtitle: 'Please wait while we confirm your payment with Paystack.',
//       bg: 'bg-blue-50',
//       border: 'border-blue-200',
//     },
//     success: {
//       icon: <CheckCircle size={64} className="text-green-500" />,
//       title: 'Payment Successful!',
//       subtitle: message,
//       bg: 'bg-green-50',
//       border: 'border-green-200',
//     },
//     failed: {
//       icon: <XCircle size={64} className="text-red-500" />,
//       title: 'Payment Failed',
//       subtitle: message,
//       bg: 'bg-red-50',
//       border: 'border-red-200',
//     },
//     pending: {
//       icon: <Clock size={64} className="text-yellow-500" />,
//       title: 'Payment Pending',
//       subtitle: 'Your payment is being processed. Please check back shortly.',
//       bg: 'bg-yellow-50',
//       border: 'border-yellow-200',
//     },
//   };

//   const current = cfg[status];

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className={`bg-white rounded-2xl border-2 ${current.border} shadow-lg p-10 max-w-md w-full text-center`}>
//         <div className={`w-24 h-24 ${current.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
//           {current.icon}
//         </div>

//         <h1 className="text-2xl font-bold text-gray-800 mb-3">{current.title}</h1>
//         <p className="text-gray-500 mb-6">{current.subtitle}</p>

//         {reference && (
//           <div className="bg-gray-50 rounded-lg p-3 mb-6">
//             <p className="text-xs text-gray-400">Reference</p>
//             <p className="font-mono text-sm font-medium text-gray-700">{reference}</p>
//           </div>
//         )}

//         {status !== 'verifying' && (
//           <>
//             <p className="text-sm text-gray-400 mb-4">
//               Redirecting to dashboard in <span className="font-bold text-gray-600">{countdown}</span> seconds...
//             </p>
//             <button
//               onClick={redirectToDashboard}
//               className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${
//                 status === 'success' ? 'bg-green-600 hover:bg-green-700' :
//                 status === 'failed' ? 'bg-red-600 hover:bg-red-700' :
//                 'bg-yellow-500 hover:bg-yellow-600'
//               }`}
//             >
//               Go to Dashboard Now
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentCallback;


/**
 * Payment Callback Page
 * Handles Paystack redirect after payment
 * Shows success/failed/pending status and redirects to dashboard
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Loader2, ArrowRight } from 'lucide-react';
import { verifyPayment } from '../../services/paymentService';
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

// Button Component
const Button = ({ children, variant = 'primary', size = 'medium', icon: Icon, onClick, loading, disabled, className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  };
  const sizes = {
    large: 'h-12 px-5 text-sm',
    medium: 'h-10 px-4 text-sm',
    small: 'h-8 px-3 text-xs',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {Icon && !loading && <Icon size={size === 'small' ? 14 : 16} />}
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Status Icon Container
const StatusIconContainer = ({ status, children }) => {
  const bgColors = {
    verifying: 'bg-blue-50',
    success: 'bg-green-50',
    failed: 'bg-red-50',
    pending: 'bg-yellow-50',
  };
  return (
    <div className={`w-20 h-20 sm:w-24 sm:h-24 ${bgColors[status]} rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6`}>
      {children}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed | pending
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    if (reference) {
      verifyTransaction();
    } else {
      setStatus('failed');
      setMessage('No payment reference found. Please contact support.');
    }
  }, [reference]);

  useEffect(() => {
    if (status === 'success' || status === 'failed' || status === 'pending') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            redirectToDashboard();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const verifyTransaction = async () => {
    try {
      setStatus('verifying');
      const result = await verifyPayment(reference);
      if (result.success) {
        setStatus('success');
        setMessage('Your payment was successful! Your invoice has been updated.');
      } else {
        setStatus('failed');
        setMessage(result.error || 'Payment could not be verified. Please contact support.');
      }
    } catch (err) {
      setStatus('failed');
      setMessage(err.message || 'Payment verification failed. Please contact support.');
    }
  };

  const redirectToDashboard = () => {
    if (user?.role === 'parent') {
      navigate('/parent-portal');
    } else if (user?.role === 'student') {
      navigate('/payments');
    } else {
      navigate('/dashboard');
    }
  };

  const config = {
    verifying: {
      icon: <Loader2 size={56} className="text-blue-500 animate-spin sm:w-14 sm:h-14" />,
      title: 'Verifying Payment...',
      subtitle: 'Please wait while we confirm your payment with Paystack.',
      buttonText: 'Verifying...',
      buttonDisabled: true,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    success: {
      icon: <CheckCircle size={56} className="text-green-500 sm:w-14 sm:h-14" />,
      title: 'Payment Successful!',
      subtitle: message,
      buttonText: 'Go to Dashboard Now',
      buttonVariant: 'success',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    failed: {
      icon: <XCircle size={56} className="text-red-500 sm:w-14 sm:h-14" />,
      title: 'Payment Failed',
      subtitle: message,
      buttonText: 'Go to Dashboard Now',
      buttonVariant: 'danger',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    pending: {
      icon: <Clock size={56} className="text-yellow-500 sm:w-14 sm:h-14" />,
      title: 'Payment Pending',
      subtitle: 'Your payment is being processed. Please check back shortly.',
      buttonText: 'Go to Dashboard Now',
      buttonVariant: 'warning',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
  };

  const current = config[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full overflow-hidden">
        {/* Status Border Indicator */}
        <div className={`h-1 w-full ${current.bg.replace('bg-', '')} bg-opacity-100`} style={{ background: status === 'success' ? '#22c55e' : status === 'failed' ? '#ef4444' : status === 'pending' ? '#eab308' : '#3b82f6' }} />
        
        <div className="p-6 sm:p-8 md:p-10">
          {/* Status Icon */}
          <StatusIconContainer status={status}>
            {current.icon}
          </StatusIconContainer>

          {/* Title */}
          <Text variant="h2" className="text-center font-bold text-gray-800 mb-2">
            {current.title}
          </Text>

          {/* Subtitle / Message */}
          <Text variant="body" className="text-center text-gray-500 mb-6">
            {current.subtitle}
          </Text>

          {/* Reference Number Display */}
          {reference && (
            <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100">
              <Text variant="tiny" className="text-gray-400 text-center block mb-1">
                Transaction Reference
              </Text>
              <Text variant="caption" className="font-mono font-medium text-gray-700 text-center block break-all">
                {reference}
              </Text>
            </div>
          )}

          {/* Action Section (only for non-verifying states) */}
          {status !== 'verifying' && (
            <div className="space-y-3">
              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-1 w-16 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#D94801] rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(countdown / 5) * 100}%` }}
                  />
                </div>
                <Text variant="caption" className="text-gray-400">
                  Redirecting in <span className="font-bold text-gray-600">{countdown}</span>s
                </Text>
              </div>

              {/* Manual Redirect Button */}
              <Button
                variant={current.buttonVariant || 'primary'}
                size="large"
                icon={ArrowRight}
                onClick={redirectToDashboard}
                className="w-full justify-center"
              >
                {current.buttonText}
              </Button>
            </div>
          )}

          {/* Loading State for Verifying */}
          {status === 'verifying' && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 size={16} className="animate-spin" />
                <Text variant="caption">Processing your payment...</Text>
              </div>
            </div>
          )}

          {/* Support Link */}
          {(status === 'failed' || status === 'pending') && (
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <Text variant="tiny" className="text-gray-400">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@school.com" className="text-[#D94801] hover:underline">
                  support@school.com
                </a>
              </Text>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentCallback;