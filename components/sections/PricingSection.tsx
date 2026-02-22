'use client';
import { Check, Loader, Crown } from 'lucide-react';
import { usePricing, useAuth } from '@/hooks';

export default function PricingSection() {
  const { plans, isLoading, subscribing, subscribe } = usePricing();
  const { user } = useAuth();

  if (!isLoading && plans.length === 0) return null;

  return (
    <section id="pricing" className="py-24 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <p className="text-yellow-600 text-xs font-bold uppercase tracking-[0.3em] mb-3">Membership</p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Exclusive Benefits
          </h2>
          <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
            Join our membership programme and enjoy exclusive discounts, early access, and premium perks.
          </p>
          <div className="w-16 h-px bg-yellow-400 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-80 bg-gray-100 animate-pulse rounded" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className={`relative p-8 border-2 transition-all duration-300 hover:-translate-y-1 ${
                  plan.isFeatured
                    ? 'border-yellow-400 bg-black text-white shadow-2xl'
                    : 'border-gray-200 bg-white hover:border-black'
                }`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 flex items-center gap-1.5">
                    <Crown size={11} /> Most Popular
                  </div>
                )}

                <h3 className={`text-lg font-black uppercase tracking-widest mb-2 ${plan.isFeatured ? 'text-yellow-400' : ''}`}>
                  {plan.title}
                </h3>

                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-black">£{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.isFeatured ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.isFeatured ? 'text-yellow-400' : 'text-green-500'}`} />
                      <span className={plan.isFeatured ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (!user) {
                      window.dispatchEvent(new CustomEvent('openAuth', { detail: 'signin' }));
                    } else {
                      subscribe(plan._id);
                    }
                  }}
                  disabled={subscribing === plan._id}
                  className={`w-full py-3.5 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                    plan.isFeatured
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  {subscribing === plan._id ? <><Loader size={14} className="animate-spin" /> Processing...</> : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}



// "use client";

// const plans = [
//   {
//     title: "Essentials",
//     price: 45,
//     featured: false,
//     features: [
//       "Monthly curated fragrance sample",
//       "10% discount on all purchases",
//       "Early access to new collections",
//       "Free standard delivery",
//     ],
//   },
//   {
//     title: "Premium",
//     price: 89,
//     featured: true,
//     features: [
//       "Full-size perfume delivery each month",
//       "20% discount on all purchases",
//       "Priority access to limited editions",
//       "Free express delivery worldwide",
//       "Personal style consultation",
//     ],
//   },
//   {
//     title: "Elite",
//     price: 149,
//     featured: false,
//     features: [
//       "Bespoke fragrance creation service",
//       "30% discount on all purchases",
//       "VIP access to exclusive launches",
//       "Complimentary gift wrapping",
//       "Dedicated style advisor",
//     ],
//   },
// ];

// export default function PricingSection() {
//   return (
//     <section id="pricing" className="py-20 sm:py-24 bg-white">
//       <div className="max-w-6xl mx-auto px-6 text-center">
//         {/* Heading */}
//         <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase">
//           Membership Packages
//         </h2>

//         <div className="flex items-center justify-center my-6">
//           <span className="w-10 sm:w-12 h-px bg-black" />
//           <span className="mx-3">✦</span>
//           <span className="w-10 sm:w-12 h-px bg-black" />
//         </div>

//         <p className="max-w-2xl mx-auto text-gray-600 italic leading-relaxed text-sm sm:text-base">
//           Join our exclusive membership program and enjoy premium benefits, personalized service, 
//           and significant savings on our luxury collection.
//         </p>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16 mt-20">
//           {plans.map((plan) => (
//             <div
//               key={plan.title}
//               className={`bg-[#faf7f5] px-6 py-10 flex flex-col items-center transition-all duration-300 ${
//                 plan.featured
//                   ? "md:scale-105 shadow-xl border-2 border-brandGold"
//                   : "shadow-md hover:shadow-lg"
//               }`}
//             >
//               {plan.featured && (
//                 <span className="bg-brandGold text-white text-xs px-4 py-1 uppercase tracking-widest mb-4">
//                   Most Popular
//                 </span>
//               )}

//               {/* Price */}
//               <h3 className="text-4xl sm:text-5xl font-serif">
//                 £{plan.price}
//                 <span className="text-base italic font-light"> /month</span>
//               </h3>

//               <div className="flex items-center my-6 w-full">
//                 <span className="flex-1 h-px bg-black" />
//                 <span className="mx-3">✦</span>
//                 <span className="flex-1 h-px bg-black" />
//               </div>

//               {/* Title */}
//               <h4 className="text-lg sm:text-xl font-bold uppercase tracking-widest mb-6">
//                 {plan.title}
//               </h4>

//               {/* Features */}
//               <ul className="space-y-3 text-gray-700 text-sm sm:text-base mb-10 text-left">
//                 {plan.features.map((feature, index) => (
//                   <li key={index} className="flex items-start">
//                     <span className="text-brandGold mr-2 text-lg">✓</span>
//                     {feature}
//                   </li>
//                 ))}
//               </ul>

//               {/* Button */}
//               <button className={`mt-auto w-full py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
//                 plan.featured
//                   ? "bg-black text-white hover:bg-brandGold"
//                   : "border-2 border-black text-black hover:bg-black hover:text-white"
//               }`}>
//                 Subscribe Now
//               </button>
//             </div>
//           ))}
//         </div>

//         <p className="mt-12 text-sm text-gray-500">
//           All packages include access to our online collection and exclusive member events
//         </p>
//       </div>
//     </section>
//   );
// }