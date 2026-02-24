/**
 * <Toaster /> — renders toast notifications.
 * Place once in app/layout.tsx, inside the ReduxProvider:
 *
 *   import Toaster from '../components/ui/Toaster';
 *   ...
 *   <ReduxProvider>
 *     <Toaster />
 *     {children}
 *   </ReduxProvider>
 */
'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastType, ToastMessage, TOAST_EVENT } from '../hooks/useToast';
// import { TOAST_EVENT, ToastMessage, ToastType } from '../../hooks/useToast';

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} className="text-green-500 flex-shrink-0" />,
  error:   <XCircle     size={18} className="text-red-500   flex-shrink-0" />,
  info:    <Info        size={18} className="text-blue-500  flex-shrink-0" />,
  warning: <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />,
};

const BORDERS: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error:   'border-l-red-500',
  info:    'border-l-blue-500',
  warning: 'border-l-yellow-500',
};

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, message } = (e as CustomEvent).detail as { type: ToastType; message: string };
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      // Auto-dismiss after 4 s
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    };

    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 bg-white shadow-xl border border-gray-100 border-l-4 ${BORDERS[toast.type]} px-4 py-3.5 rounded pointer-events-auto animate-slideUp`}
        >
          {ICONS[toast.type]}
          <p className="text-sm text-gray-800 flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-gray-300 hover:text-gray-600 transition flex-shrink-0 mt-0.5"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.2s ease-out; }
      `}</style>
    </div>
  );
}