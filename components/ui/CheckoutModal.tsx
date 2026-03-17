'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Loader, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { ShippingAddress } from '../../types';
import { useCart, useOrders, useAuth } from '../../hooks';

// ── Square Web Payments SDK types (loaded via script tag) ──────────────────
declare global {
  interface Window {
    Square?: any;
  }
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

// Load Square Web Payments SDK script once
function useSquareScript() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.Square) { setLoaded(true); return; }

    const src =
      process.env.NEXT_PUBLIC_SQUARE_ENV === 'production'
        ? 'https://web.squarecdn.com/v1/square.js'
        : 'https://sandbox.web.squarecdn.com/v1/square.js';

    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => setLoaded(true);
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, []);

  return { loaded, error };
}

export default function CheckoutModal({ onClose, onSuccess }: Props) {
  const { items, total } = useCart();
  const { placeOrder, isCreating, error: orderError } = useOrders();
  const { user } = useAuth();
  const { loaded: sdkLoaded, error: sdkError } = useSquareScript();

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    phone: user?.phone || '',
  });

  // Refs to hold Square payment objects
  const paymentsRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const shipping = total >= 100 ? 0 : 4.99;
  const grandTotal = total + shipping;

  // ── Step 1: Address submit ──────────────────────────────────────────────
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  // ── Step 2: Mount Square card form when step becomes 'payment' ──────────
  useEffect(() => {
    if (step !== 'payment' || !sdkLoaded || !cardContainerRef.current) return;
    if (cardRef.current) return; // already mounted

    async function mountCard() {
      try {
        const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!;
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;

        const payments = window.Square!.payments(appId, locationId);
        paymentsRef.current = payments;

        const card = await payments.card({
          style: {
            '.input-container': { borderRadius: '0px', borderColor: '#e5e7eb' },
            '.input-container.is-focus': { borderColor: '#000000' },
            '.input-container.is-error': { borderColor: '#ef4444' },
            '.message-text': { color: '#6b7280' },
            '.message-icon': { color: '#6b7280' },
          },
        });

        await card.attach('#sq-card-container');
        cardRef.current = card;
      } catch (err: any) {
        setPaymentError('Failed to load payment form. Please refresh and try again.');
        console.error('Square card mount error:', err);
      }
    }

    mountCard();

    // Cleanup on unmount
    return () => {
      if (cardRef.current) {
        cardRef.current.destroy().catch(() => {});
        cardRef.current = null;
      }
    };
  }, [step, sdkLoaded]);

  // ── Step 2: Payment submit ───────────────────────────────────────────────
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardRef.current || !paymentsRef.current) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Tokenise the card (get nonce)
      const tokenResult = await cardRef.current.tokenize();
      if (tokenResult.status !== 'OK') {
        const msg = tokenResult.errors?.[0]?.message || 'Card tokenisation failed';
        setPaymentError(msg);
        setIsProcessing(false);
        return;
      }

      const sourceId: string = tokenResult.token;

      // SCA/3DS verification (required for UK/EEA cards under PSD2)
      let verificationToken: string | undefined;
      try {
        const verificationDetails = {
          amount: grandTotal.toFixed(2),
          /* Square expects string amounts for verifyBuyer */
          billingContact: {
            familyName: address.fullName.split(' ').slice(1).join(' ') || address.fullName,
            givenName: address.fullName.split(' ')[0],
            addressLines: [address.address],
            city: address.city,
            postalCode: address.postcode,
            countryCode: 'GB',
          },
          currencyCode: 'GBP',
          intent: 'CHARGE',
        };

        const verifyResult = await paymentsRef.current.verifyBuyer(sourceId, verificationDetails);
        verificationToken = verifyResult?.token;
      } catch {
        // verifyBuyer may throw if 3DS is not needed; safe to continue
      }

      // Send to backend
      const orderItems = items.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      }));

      const result = await placeOrder({
        items: orderItems,
        shippingAddress: address,
        sourceId,
        verificationToken,
      });

      if (result.success) {
        setStep('success');
        setTimeout(onSuccess, 2500);
      } else {
        setPaymentError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setPaymentError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <h2 className="text-xl font-black uppercase tracking-widest">Checkout</h2>
          <div className="flex items-center gap-3 mt-4">
            {['address', 'payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  step === s
                    ? 'bg-black text-white'
                    : step === 'payment' && i === 0 || step === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 capitalize">
                  {s}
                </span>
                {i === 0 && <div className="w-8 h-px bg-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* Order summary */}
          <div className="mb-6 p-4 bg-gray-50 text-sm space-y-1.5">
            {items.map((item) => (
              <div key={item.product._id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.product.name}{' '}
                  <span className="text-gray-400">×{item.quantity}</span>
                </span>
                <span className="font-medium">
                  £{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-black">
              <span>Total</span>
              <span>£{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* ── STEP: Address ─────────────────────────────────────────────── */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h3 className="font-black text-sm uppercase tracking-widest mb-4">
                Shipping Address
              </h3>
              {[
                { label: 'Full Name', name: 'fullName', value: address.fullName },
                { label: 'Address', name: 'address', value: address.address },
                { label: 'City', name: 'city', value: address.city },
                { label: 'Postcode', name: 'postcode', value: address.postcode },
                { label: 'Country', name: 'country', value: address.country },
              ].map(({ label, name, value }) => (
                <div key={name}>
                  <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={value}
                    required
                    onChange={(e) =>
                      setAddress((a) => ({ ...a, [name]: e.target.value }))
                    }
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition"
                  />
                </div>
              ))}

              {orderError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-4 py-3 border border-red-200">
                  <AlertCircle size={14} /> {orderError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {/* ── STEP: Payment ─────────────────────────────────────────────── */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <h3 className="font-black text-sm uppercase tracking-widest">
                Payment Details
              </h3>

              {sdkError && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-4 py-3 border border-red-200">
                  <AlertCircle size={14} />
                  Failed to load payment SDK. Please refresh.
                </div>
              )}

              {/* Square mounts its card form here */}
              <div
                id="sq-card-container"
                ref={cardContainerRef}
                className="min-h-[100px] border border-gray-200 p-4"
              >
                {!sdkLoaded && (
                  <div className="flex items-center justify-center h-16 gap-2 text-gray-400 text-sm">
                    <Loader size={14} className="animate-spin" />
                    Loading payment form...
                  </div>
                )}
              </div>

              {(paymentError || orderError) && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-4 py-3 border border-red-200">
                  <AlertCircle size={14} />
                  {paymentError || orderError}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || isCreating || !sdkLoaded}
                className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing || isCreating ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Pay £{grandTotal.toFixed(2)} Now
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                <Lock size={10} />
                Secured by Square. We never store your card details.
              </p>
            </form>
          )}

          {/* ── STEP: Success ─────────────────────────────────────────────── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-black mb-2">Order Placed!</h3>
              <p className="text-gray-500 text-sm">
                Thank you. You will receive a confirmation email shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// 'use client';
// import { useState } from 'react';
// import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { ShippingAddress } from '../../types';
// import { useCart, useOrders, useAuth } from '../../hooks';


// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// interface Props {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function CheckoutModal({ onClose, onSuccess }: Props) {
//   const { items, total } = useCart();
//   const { placeOrder, clientSecret, isCreating, error: orderError } = useOrders();
//   const { user } = useAuth();
//   const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
//   const [address, setAddress] = useState<ShippingAddress>({
//     fullName: user?.name || '',
//     address: '',
//     city: '',
//     postcode: '',
//     country: 'United Kingdom',
//     phone: user?.phone || '',
//   });

//   const shipping = total >= 100 ? 0 : 4.99;

//   const handleAddressSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const orderItems = items.map((i) => ({ product: i.product._id, quantity: i.quantity }));
//     const result = await placeOrder({ items: orderItems, shippingAddress: address });
//     if (result.success) setStep('payment');
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl">
//         <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10">
//           <X size={20} />
//         </button>

//         <div className="px-8 pt-8 pb-6 border-b border-gray-100">
//           <h2 className="text-xl font-black uppercase tracking-widest">Checkout</h2>
//           <div className="flex items-center gap-3 mt-4">
//             {['address', 'payment'].map((s, i) => (
//               <div key={s} className="flex items-center gap-2">
//                 <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
//                   step === s ? 'bg-black text-white' :
//                   (step === 'payment' && i === 0) || step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
//                 }`}>{i + 1}</div>
//                 <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 capitalize">{s}</span>
//                 {i === 0 && <div className="w-8 h-px bg-gray-300" />}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-8">
//           <div className="mb-6 p-4 bg-gray-50 text-sm space-y-1.5">
//             {items.map((item) => (
//               <div key={item.product._id} className="flex justify-between">
//                 <span className="text-gray-600">{item.product.name} <span className="text-gray-400">×{item.quantity}</span></span>
//                 <span className="font-medium">£{(item.product.price * item.quantity).toFixed(2)}</span>
//               </div>
//             ))}
//             <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
//               <span className="text-gray-600">Shipping</span>
//               <span>{shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`}</span>
//             </div>
//             <div className="flex justify-between font-black">
//               <span>Total</span>
//               <span>£{(total + shipping).toFixed(2)}</span>
//             </div>
//           </div>

//           {step === 'address' && (
//             <form onSubmit={handleAddressSubmit} className="space-y-4">
//               <h3 className="font-black text-sm uppercase tracking-widest mb-4">Shipping Address</h3>
//               {[
//                 { label: 'Full Name', name: 'fullName', value: address.fullName },
//                 { label: 'Address', name: 'address', value: address.address },
//                 { label: 'City', name: 'city', value: address.city },
//                 { label: 'Postcode', name: 'postcode', value: address.postcode },
//                 { label: 'Country', name: 'country', value: address.country },
//               ].map(({ label, name, value }) => (
//                 <div key={name}>
//                   <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5 text-gray-500">{label}</label>
//                   <input
//                     type="text" value={value} required
//                     onChange={(e) => setAddress((a) => ({ ...a, [name]: e.target.value }))}
//                     className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition"
//                   />
//                 </div>
//               ))}

//               {orderError && (
//                 <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-4 py-3 border border-red-200">
//                   <AlertCircle size={14} /> {orderError}
//                 </div>
//               )}

//               <button type="submit" disabled={isCreating} className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2">
//                 {isCreating ? <><Loader size={14} className="animate-spin" /> Creating Order...</> : 'Continue to Payment'}
//               </button>
//             </form>
//           )}

//           {step === 'payment' && clientSecret && (
//             <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
//               <PaymentForm onSuccess={() => { setStep('success'); setTimeout(onSuccess, 2000); }} />
//             </Elements>
//           )}

//           {step === 'success' && (
//             <div className="text-center py-8">
//               <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
//               <h3 className="text-xl font-black mb-2">Order Placed!</h3>
//               <p className="text-gray-500 text-sm">Thank you. You will receive a confirmation email shortly.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;
//     setIsProcessing(true);
//     setError(null);

//     const { error: stripeError } = await stripe.confirmPayment({
//       elements,
//       confirmParams: { return_url: `${window.location.origin}/orders` },
//       redirect: 'if_required',
//     });

//     if (stripeError) {
//       setError(stripeError.message || 'Payment failed');
//       setIsProcessing(false);
//     } else {
//       onSuccess();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <h3 className="font-black text-sm uppercase tracking-widest">Payment Details</h3>
//       <PaymentElement />
//       {error && (
//         <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-4 py-3 border border-red-200">
//           <AlertCircle size={14} /> {error}
//         </div>
//       )}
//       <button type="submit" disabled={isProcessing || !stripe} className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2">
//         {isProcessing ? <><Loader size={14} className="animate-spin" /> Processing...</> : 'Pay Now'}
//       </button>
//       <p className="text-[10px] text-gray-400 text-center">Secured by Stripe. We never store your card details.</p>
//     </form>
//   );
// }