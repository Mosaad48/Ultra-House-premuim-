import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Printer, Share2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50/50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full px-6 text-center"
      >
        <div className="bg-white p-12 rounded-[48px] shadow-xl shadow-black/[0.03] ring-1 ring-black/[0.05] relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 relative z-10">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl font-display font-black mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Thank you for your purchase. We've received your order and we're getting it ready for shipment. You'll receive a confirmation email shortly.
          </p>

          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="p-6 bg-gray-50 rounded-[28px] border border-gray-100 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Order Number</p>
                <p className="text-lg font-bold">#ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white transition-colors">
                  <Printer size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-white transition-colors">
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/')} 
              className="flex-1 h-16 bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 group"
            >
              Continue Shopping
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              className="flex-shrink-0 h-16 px-8 border-gray-200 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
            >
              Track Order
            </Button>
          </div>
        </div>

        <p className="mt-12 text-sm text-gray-400 font-medium">
          Need help? <button className="text-black font-bold underline decoration-accent/30 hover:decoration-accent/60 transition-all">Contact our support team</button>
        </p>
      </motion.div>
    </div>
  );
};
