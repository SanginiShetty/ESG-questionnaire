// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/Button';
// import { User, LogOut, Menu, X } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export const Header: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const router = useRouter();

//   const handleLogout = () => {
//     logout();
//     localStorage.clear();
//     router.push('/auth/login');
//     useRouter
//   };

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard' },
//     { name: 'Questionnaire', href: '/questionnaire' },
//     { name: 'Summary', href: '/summary' },
//   ];

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo and Navigation */}
//           <div className="flex items-center">
//             <Link href="/dashboard" className="flex-shrink-0">
//               <h1 className="text-xl font-bold text-primary-600">ESG Questionnaire</h1>
//             </Link>
            
//             {/* Desktop Navigation */}
//             <nav className="hidden md:ml-8 md:flex md:space-x-8">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </nav>
//           </div>

//           {/* User Menu */}
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:flex items-center space-x-3">
//               <div className="flex items-center space-x-2 text-sm text-gray-700">
//                 <User className="w-4 h-4" />
//                 <span>{user?.name}</span>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </Button>
//             </div>

//             {/* Mobile menu button */}
//             <button
//               type="button"
//               className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
//             {navigation.map((item) => (
//               <Link
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-700 hover:text-primary-600 block px-3 py-2 text-base font-medium"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}
//             <div className="pt-4 border-t border-gray-200">
//               <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
//                 <User className="w-4 h-4" />
//                 <span>{user?.name}</span>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleLogout}
//                 className="w-full mt-2 flex items-center justify-center space-x-2"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { User, LogOut, Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    router.push('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Questionnaire', href: '/questionnaire' },
    { name: 'Summary', href: '/summary' },
  ];

  const isActiveRoute = (href: string) => pathname === href;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  ESG Questionnaire
                </h1>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                    isActiveRoute(item.href)
                      ? 'text-emerald-600 bg-emerald-50 shadow-sm'
                      : 'text-gray-700 hover:text-emerald-600'
                  }`}
                >
                  {item.name}
                  {isActiveRoute(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="max-w-32 truncate">{user?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-3 flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30 hidden md:block"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};