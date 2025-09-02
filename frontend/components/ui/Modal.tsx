// import React, { Fragment } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { X } from 'lucide-react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title?: string;
//   children: React.ReactNode;
//   size?: 'sm' | 'md' | 'lg' | 'xl';
//   showCloseButton?: boolean;
// }

// export const Modal: React.FC<ModalProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = 'md',
//   showCloseButton = true
// }) => {
//   const sizeClasses = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl'
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
//                 {title && (
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900 mb-4"
//                   >
//                     {title}
//                   </Dialog.Title>
//                 )}
                
//                 {showCloseButton && (
//                   <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 )}
                
//                 <div className="mt-2">
//                   {children}
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  overlayClassName?: string;
  panelClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  variant = 'default',
  overlayClassName = '',
  panelClassName = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  };

  const variantClasses = {
    default: 'bg-white border-gray-100',
    success: 'bg-white border-emerald-100',
    warning: 'bg-white border-amber-100',
    danger: 'bg-white border-red-100'
  };

  const titleVariantClasses = {
    default: 'text-gray-900',
    success: 'text-emerald-900',
    warning: 'text-amber-900',
    danger: 'text-red-900'
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop with enhanced blur effect */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm ${overlayClassName}`} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel 
                className={`
                  w-full ${sizeClasses[size]} transform overflow-hidden 
                  rounded-xl border-2 p-0 text-left align-middle 
                  shadow-2xl transition-all
                  ${variantClasses[variant]} ${panelClassName}
                `}
              >
                {/* Header Section */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className={`text-xl font-bold leading-6 ${titleVariantClasses[variant]}`}
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
                
                {/* Content Section */}
                <div className={`${title || showCloseButton ? 'p-6 pt-4' : 'p-6'}`}>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};