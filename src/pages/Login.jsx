// // import React, { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import Input from '../components/common/Input';
// // import Button from '../components/common/Button';
// // import Alert from '../components/common/Alert';
// // import useAuth from '../hooks/useAuth';

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const { login, loading: authLoading } = useAuth();

// //   const [formData, setFormData] = useState({
// //     registration_number: '',
// //     password: '',
// //   });

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [attempts, setAttempts] = useState(0);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //     setError('');
// //   };

// //   const openWhatsApp = () => {
// //     window.open('https://wa.me/2348035312904', '_blank');
// //   };

// //   const openEmail = () => {
// //     window.location.href = 'mailto:concordtutorsnurprysch@gmail.com';
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setSuccess('');

// //     // Basic validation
// //     if (!formData.registration_number.trim()) {
// //       setError('Registration number is required');
// //       return;
// //     }

// //     if (!formData.password.trim()) {
// //       setError('Password is required');
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const credentials = {
// //         registration_number: formData.registration_number.trim(),
// //         password: formData.password
// //       };

// //       await login(credentials);

// //       setSuccess('Login successful! Redirecting...');
// //       setAttempts(0);
      
// //       setTimeout(() => {
// //         navigate('/dashboard', { replace: true });
// //       }, 1000);

// //     } catch (err) {
// //       const newAttempts = attempts + 1;
// //       setAttempts(newAttempts);
      
// //       // The error is already processed by handleApiError in AuthContext
// //       // Just use the error message as is
// //       let errorMessage = err.message || 'Login failed. Please try again.';
      
// //       // Clean up error messages for better user experience
// //       if (errorMessage.toLowerCase().includes('invalid') || 
// //           errorMessage.includes('401') || 
// //           errorMessage.includes('unauthorized')) {
// //         errorMessage = 'Invalid registration number or password. Please check your credentials.';
// //       } else if (errorMessage.toLowerCase().includes('network') || 
// //                  errorMessage.toLowerCase().includes('connection') ||
// //                  errorMessage.toLowerCase().includes('failed to fetch')) {
// //         errorMessage = 'Unable to connect to server. Please check your internet connection.';
// //       }
      
// //       // Show admin contact after 3 failed attempts
// //       if (newAttempts >= 3) {
// //         errorMessage += ' If you continue to have issues, please contact the school administration via WhatsApp or Email.';
// //       }
      
// //       setError(errorMessage);
      
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex">
// //       <div className="hidden lg:flex lg:w-1/2 bg-[#2b2f83] relative overflow-hidden">
// //         <div className="absolute inset-0">
// //           <img
// //             src="/students.png"
// //             alt="Concord Tutor School Students"
// //             className="w-full h-full object-cover"
// //           />
// //         </div>
// //       </div>

// //       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-neutral-50 to-white">
// //         <div className="w-full max-w-md">
// //           <div className="text-center mb-6 md:mb-8">
// //             <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full mb-3 md:mb-4">
// //               <img
// //                 src="/logo.png"
// //                 alt="Concord Tutor School Logo"
// //                 className="w-7 h-7 md:w-8 md:h-8"
// //               />
// //             </div>
// //             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
// //               Sign In
// //             </h2>
// //           </div>

// //           {success && (
// //             <Alert
// //               type="success"
// //               message={success}
// //               className="mb-4 md:mb-6"
// //             />
// //           )}

// //           {error && (
// //             <Alert
// //               type="error"
// //               message={error}
// //               onClose={() => setError('')}
// //               className="mb-4 md:mb-6"
// //             />
// //           )}

// //           <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
// //             <Input
// //               label="Registration Number"
// //               name="registration_number"
// //               type="text"
// //               value={formData.registration_number}
// //               onChange={handleChange}
// //               placeholder=" "
// //               required={false}
// //               autoFocus
// //               disabled={loading || authLoading}
// //             />

// //             <Input
// //               label="Password"
// //               name="password"
// //               type="password"
// //               value={formData.password}
// //               onChange={handleChange}
// //               placeholder=" "
// //               required={false}
// //               disabled={loading || authLoading}
// //             />

// //             {attempts >= 3 && (
// //               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
// //                 <div className="flex">
// //                   <div className="flex-shrink-0">
// //                     <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
// //                       <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
// //                     </svg>
// //                   </div>
// //                   <div className="ml-3">
// //                     <p className="text-sm text-yellow-700 font-medium">
// //                       Having trouble logging in?
// //                     </p>
// //                     <div className="mt-2 flex flex-col sm:flex-row gap-2">
// //                       <button
// //                         type="button"
// //                         onClick={openWhatsApp}
// //                         className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
// //                       >
// //                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
// //                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
// //                         </svg>
// //                         WhatsApp
// //                       </button>
// //                       <button
// //                         type="button"
// //                         onClick={openEmail}
// //                         className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
// //                       >
// //                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
// //                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
// //                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
// //                         </svg>
// //                         Email
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <Button
// //               type="submit"
// //               variant="primary"
// //               fullWidth
// //               loading={loading || authLoading}
// //               disabled={loading || authLoading}
// //               className="mt-4 md:mt-6"
// //             >
// //               {loading || authLoading ? 'Signing in...' : 'Sign In'}
// //             </Button>
// //           </form>

// //           <div className="mt-4 text-center">
// //             <Link
// //               to="/"
// //               className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center transition-colors"
// //             >
// //               <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
// //                 <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
// //               </svg>
// //               Back to home
// //             </Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Input from '../components/common/Input';
// import Button from '../components/common/Button';
// import Alert from '../components/common/Alert';
// import useAuth from '../hooks/useAuth';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, loading: authLoading } = useAuth();

//   const [formData, setFormData] = useState({
//     registration_number: '',
//     password: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [attempts, setAttempts] = useState(0);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setError('');
//   };

//   const openWhatsApp = () => {
//     window.open('https://wa.me/2348035312904', '_blank');
//   };

//   const openEmail = () => {
//     window.location.href = 'mailto:concordtutorsnurprysch@gmail.com';
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     // Basic validation
//     if (!formData.registration_number.trim()) {
//       setError('Registration number is required');
//       return;
//     }

//     if (!formData.password.trim()) {
//       setError('Password is required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const credentials = {
//         registration_number: formData.registration_number.trim(),
//         password: formData.password
//       };

//       const response = await login(credentials);
      
//       // Get user role from response
//       const userRole = response?.user?.role || response?.role;
//       const userName = response?.user?.full_name || response?.full_name || 'User';
      
//       setSuccess(`Welcome ${userName}! Redirecting...`);
//       setAttempts(0);
      
//       // Redirect based on user role
//       setTimeout(() => {
//         if (userRole === 'parent') {
//           navigate('/parent-portal', { replace: true });
//         } else if (userRole === 'student') {
//           navigate('/student-dashboard', { replace: true });
//         } else {
//           navigate('/dashboard', { replace: true });
//         }
//       }, 1000);

//     } catch (err) {
//       const newAttempts = attempts + 1;
//       setAttempts(newAttempts);
      
//       // The error is already processed by handleApiError in AuthContext
//       // Just use the error message as is
//       let errorMessage = err.message || 'Login failed. Please try again.';
      
//       // Clean up error messages for better user experience
//       if (errorMessage.toLowerCase().includes('invalid') || 
//           errorMessage.includes('401') || 
//           errorMessage.includes('unauthorized')) {
//         errorMessage = 'Invalid registration number or password. Please check your credentials.';
//       } else if (errorMessage.toLowerCase().includes('network') || 
//                  errorMessage.toLowerCase().includes('connection') ||
//                  errorMessage.toLowerCase().includes('failed to fetch')) {
//         errorMessage = 'Unable to connect to server. Please check your internet connection.';
//       } else if (errorMessage.toLowerCase().includes('deactivated')) {
//         errorMessage = 'Your account has been deactivated. Please contact the school administration.';
//       }
      
//       // Show admin contact after 3 failed attempts
//       if (newAttempts >= 3) {
//         errorMessage += ' If you continue to have issues, please contact the school administration via WhatsApp or Email.';
//       }
      
//       setError(errorMessage);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       <div className="hidden lg:flex lg:w-1/2 bg-[#2b2f83] relative overflow-hidden">
//         <div className="absolute inset-0">
//           <img
//             src="/students.png"
//             alt="Concord Tutor School Students"
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>

//       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-neutral-50 to-white">
//         <div className="w-full max-w-md">
//           <div className="text-center mb-6 md:mb-8">
//             <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full mb-3 md:mb-4">
//               <img
//                 src="/logo.png"
//                 alt="Concord Tutor School Logo"
//                 className="w-7 h-7 md:w-8 md:h-8"
//               />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//               Sign In
//             </h2>
//             <p className="text-sm text-gray-500">
//               Enter your registration number and password
//             </p>
//           </div>

//           {success && (
//             <Alert
//               type="success"
//               message={success}
//               className="mb-4 md:mb-6"
//               autoDismiss={true}
//               duration={3000}
//             />
//           )}

//           {error && (
//             <Alert
//               type="error"
//               message={error}
//               onClose={() => setError('')}
//               className="mb-4 md:mb-6"
//             />
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
//             <Input
//               label="Registration Number"
//               name="registration_number"
//               type="text"
//               value={formData.registration_number}
//               onChange={handleChange}
//               placeholder="e.g., CTS_1234"
//               required={false}
//               autoFocus
//               disabled={loading || authLoading}
//             />

//             <Input
//               label="Password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required={false}
//               disabled={loading || authLoading}
//             />

//             {attempts >= 3 && (
//               <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-yellow-700 font-medium">
//                       Having trouble logging in?
//                     </p>
//                     <div className="mt-2 flex flex-col sm:flex-row gap-2">
//                       <button
//                         type="button"
//                         onClick={openWhatsApp}
//                         className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
//                       >
//                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                         </svg>
//                         WhatsApp
//                       </button>
//                       <button
//                         type="button"
//                         onClick={openEmail}
//                         className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-600 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors"
//                       >
//                         <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                           <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                         </svg>
//                         Email
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <Button
//               type="submit"
//               variant="primary"
//               fullWidth
//               loading={loading || authLoading}
//               disabled={loading || authLoading}
//               className="mt-4 md:mt-6"
//             >
//               {loading || authLoading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-xs text-gray-500">
//               Need help? Contact the school administration
//             </p>
//             <div className="mt-2 flex justify-center gap-3">
//               <button
//                 onClick={openWhatsApp}
//                 className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
//               >
//                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                 </svg>
//                 WhatsApp
//               </button>
//               <button
//                 onClick={openEmail}
//                 className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
//               >
//                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                   <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                 </svg>
//                 Email
//               </button>
//             </div>
//           </div>

//           <div className="mt-4 text-center">
//             <Link
//               to="/"
//               className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center transition-colors"
//             >
//               <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//               </svg>
//               Back to home
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


/**
 * Login Page
 * School management system authentication
 * Fully responsive: mobile-first, tablet, desktop
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, Mail, Phone, User, Lock, ArrowLeft, Building2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

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

// Input Component with Eye Toggle
const Input = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  disabled, 
  autoFocus,
  icon: Icon,
  showPasswordToggle = false,
  onTogglePassword
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleToggle = () => {
    const newState = !showPassword;
    setShowPassword(newState);
    if (onTogglePassword) onTogglePassword(newState);
  };
  
  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[10px] sm:text-xs font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon size={16} className="text-gray-400" />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D94801] focus:border-transparent transition-all ${
            Icon ? 'pl-9' : 'pl-3'
          } ${showPasswordToggle ? 'pr-9' : 'pr-3'} disabled:bg-gray-50 disabled:text-gray-400`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={handleToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// Button Component
const Button = ({ children, variant = 'primary', fullWidth, onClick, loading, disabled, type = 'button', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease rounded-xl cursor-pointer';
  const variants = {
    primary: 'bg-[#D94801] text-white hover:bg-[#C24000] active:bg-[#A93600] shadow-sm',
    secondary: 'bg-[#1D2B49] text-white hover:bg-[#24385C] active:bg-[#324A74]',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} py-2.5 px-4 text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
      {children}
    </button>
  );
};

// Alert Component
const Alert = ({ type, message, onClose }) => {
  const config = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '✓' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '!' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '⚠' },
  };
  const c = config[type] || config.error;
  
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-3 mb-4`}>
      <div className="flex items-start gap-2">
        <span className={`${c.text} font-bold text-sm`}>{c.icon}</span>
        <p className={`flex-1 text-xs ${c.text}`}>{message}</p>
        {onClose && (
          <button onClick={onClose} className={`${c.text} hover:opacity-70`}>×</button>
        )}
      </div>
    </div>
  );
};

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    registration_number: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/2348035312904', '_blank');
  };

  const openEmail = () => {
    window.location.href = 'mailto:concordtutorsnurprysch@gmail.com';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.registration_number.trim()) {
      setError('Registration number is required');
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const credentials = {
        registration_number: formData.registration_number.trim(),
        password: formData.password
      };

      await login(credentials);

      setSuccess('Login successful! Redirecting...');
      setAttempts(0);
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);

    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      let errorMessage = err.message || 'Login failed. Please try again.';
      
      if (errorMessage.toLowerCase().includes('invalid') || 
          errorMessage.includes('401') || 
          errorMessage.includes('unauthorized')) {
        errorMessage = 'Invalid registration number or password. Please check your credentials.';
      } else if (errorMessage.toLowerCase().includes('network') || 
                 errorMessage.toLowerCase().includes('connection') ||
                 errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      }
      
      if (newAttempts >= 3) {
        errorMessage += ' If you continue to have issues, please contact the school administration via WhatsApp or Email.';
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section with School Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1D2B49] to-[#24385C] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/students.png"
            alt="Concord Tutor School Students"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B49]/80 to-transparent" />
        </div>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col justify-between p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <img src="/logo.png" alt="Logo" className="w-6 h-6" />
            </div>
            <div>
              <Text variant="h3" className="font-bold text-white">Concord Tutor School</Text>
              <Text variant="tiny" className="text-white/70">Excellence in Education</Text>
            </div>
          </div>
          
          <div className="pb-8">
            <Text variant="h1" className="text-white font-bold mb-4">
              Welcome Back
            </Text>
            <Text variant="body" className="text-white/80">
              Sign in to access your dashboard and manage your academic activities.
            </Text>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo - Visible only on mobile */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1D2B49] rounded-2xl mb-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            </div>
            <Text variant="h3" className="font-bold text-gray-800">Concord Tutor School</Text>
            <Text variant="tiny" className="text-gray-400">Sign in to your account</Text>
          </div>
          
          {/* Desktop Title - Hidden on mobile */}
          <div className="hidden lg:block text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1D2B49] rounded-2xl mb-4">
              <img src="/logo.png" alt="Logo" className="w-9 h-9" />
            </div>
            <Text variant="h2" className="font-bold text-gray-800">Sign In</Text>
            <Text variant="caption" className="text-gray-400 mt-1">Enter your credentials to continue</Text>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert type="success" message={success} />
          )}

          {/* Error Alert */}
          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registration Number"
              name="registration_number"
              type="text"
              value={formData.registration_number}
              onChange={handleChange}
              placeholder="Enter your registration number"
              required
              autoFocus
              disabled={loading || authLoading}
              icon={User}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading || authLoading}
              icon={Lock}
              showPasswordToggle
            />

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-[10px] sm:text-xs text-[#D94801] hover:text-[#C24000] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Support Alert after multiple attempts */}
            {attempts >= 3 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <Text variant="tiny" className="font-semibold text-yellow-800 mb-2">
                      Having trouble logging in?
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={openWhatsApp}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-[10px] font-medium hover:bg-yellow-200 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp Support
                      </button>
                      <button
                        type="button"
                        onClick={openEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-[10px] font-medium hover:bg-yellow-200 transition-colors"
                      >
                        <Mail size={12} />
                        Email Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading || authLoading}
              disabled={loading || authLoading}
              className="mt-6"
            >
              <LogIn size={16} />
              {loading || authLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#D94801] transition-colors"
            >
              <ArrowLeft size={12} />
              Back to home
            </Link>
          </div>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <Text variant="tiny" className="text-gray-400">
              © {new Date().getFullYear()} Concord Tutor School. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;