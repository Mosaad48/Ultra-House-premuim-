import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { toast } from 'sonner';

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'United States',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        storeId: items[0]?.storeId || 'default',
        userId: user?.uid || 'guest',
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          zipCode: formData.zipCode
        },
        items: items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0]
        })),
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      navigate('/order-success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'orders');
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-gray-300" size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Add some amazing products to your cart before checking out.</p>
        <Button onClick={() => navigate('/')} className="bg-black text-white hover:bg-gray-800 rounded-xl px-8 h-12">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to store</span>
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Content */}
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-black">1</div>
                <h2 className="text-xl font-display font-bold">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="you@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-black">2</div>
                <h2 className="text-xl font-display font-bold">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    required 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    required 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    required 
                    placeholder="123 Main St, Apt 4B" 
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    required 
                    placeholder="New York" 
                    value={formData.city}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                  <Input 
                    id="zipCode" 
                    name="zipCode" 
                    required 
                    placeholder="10001" 
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-black">3</div>
                <h2 className="text-xl font-display font-bold">Payment Information</h2>
              </div>
              <Card className="p-6 border-none shadow-sm ring-1 ring-black/[0.05] rounded-2xl bg-white space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-gray-400" />
                    <span className="font-bold text-sm">Credit or Debit Card</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-4 bg-gray-200 rounded" />
                    <div className="w-6 h-4 bg-gray-200 rounded" />
                    <div className="w-6 h-4 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      name="cardNumber" 
                      required 
                      placeholder="0000 0000 0000 0000" 
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      name="expiry" 
                      required 
                      placeholder="MM / YY" 
                      value={formData.expiry}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc" 
                      name="cvc" 
                      required 
                      placeholder="123" 
                      value={formData.cvc}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl">
                  <ShieldCheck size={20} className="flex-shrink-0" />
                  <p className="text-[10px] uppercase font-black tracking-widest leading-normal">
                    Secure 256-bit SSL encrypted payment. Your card data is never stored on our servers.
                  </p>
                </div>
              </Card>
            </section>
          </div>

          {/* Sidebar Area: Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <Card className="p-8 border-none shadow-xl shadow-black/[0.02] ring-1 ring-black/[0.05] rounded-[32px] bg-white">
                <h3 className="text-lg font-display font-bold mb-8">Order Summary</h3>
                
                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate mb-1">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</p>
                      </div>
                      <div className="text-sm font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-50 mb-8 font-medium">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">Calculated at next step</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated Taxes</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-display font-bold pt-4 border-t border-gray-50">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-black text-white font-black uppercase text-xs tracking-[0.15em] rounded-2xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>

                <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <Truck size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Secure Pay</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                      <Info size={20} />
                    </div>
                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">24/7 Support</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
