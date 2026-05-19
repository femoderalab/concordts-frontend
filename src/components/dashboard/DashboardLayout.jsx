// import React from 'react';
// import Navbar from '../layout/Navbar';
// import Sidebar from '../layout/Sidebar';

// const DashboardLayout = ({ children, title }) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main content */}
//         <div className="flex-1 flex flex-col min-h-screen">
//           {/* Navbar */}
//           <Navbar />

//           {/* Main content area */}
//           <main className="flex-1 overflow-y-auto p-6">
//             {title && (
//               <div className="mb-6">
//                 <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
//                 {/* <p className="text-gray-600 mt-2">Welcome to your dashboard</p> */}
//               </div>
//             )}
            
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Fixed/Sticky - No scrolling with main content */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content area - This will scroll independently */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar - Sticky at top */}
          <div className="flex-shrink-0">
            <Navbar />
          </div>

          {/* Scrolling content area */}
          <main className="flex-1 overflow-y-auto p-6">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
              </div>
            )}
            
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;