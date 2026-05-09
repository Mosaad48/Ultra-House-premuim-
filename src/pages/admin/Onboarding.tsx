import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Store, Rocket, Layout, Palette, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../hooks/useStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

export const Onboarding = () => {
  const { user } = useAuth();
  const { setStore } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    name: '',
    slug: '',
    industry: 'electronics',
    currency: 'USD'
  });

  const handleCreateStore = async () => {
    if (!storeData.name || !storeData.slug) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newStore = {
        name: storeData.name,
        slug: storeData.slug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        ownerId: user?.uid,
        onboardingStatus: 'active',
        launchStatus: 'draft',
        industry: storeData.industry,
        theme: {
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          darkMode: false,
          typography: 'Inter'
        },
        settings: {
          currency: storeData.currency,
          timezone: 'UTC',
          email: user?.email || ''
        },
        launchChecklist: {
          domainConnected: false,
          seoReady: false,
          paymentSetup: false,
          shippingSetup: false
        },
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'stores'), newStore);
      
      // Update user currentStoreId
      if (user?.uid) {
        await updateDoc(doc(db, 'users', user.uid), {
          currentStoreId: docRef.id,
          ownedStoreIds: [docRef.id]
        });
      }

      setStore({ id: docRef.id, ...newStore } as any);
      toast.success('Your store is being prepared!');
      setStep(3);
      
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (error: any) {
      toast.error('Failed to create store: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {step === 1 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-accent">
                <Store size={40} />
              </div>
              <h1 className="text-3xl font-bold mb-4 tracking-tight">Let's build your store</h1>
              <p className="text-gray-500 mb-10 text-lg">Every great business starts with a name. What's yours?</p>
              
              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Minimalist Home" 
                    value={storeData.name}
                    onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Store URL</Label>
                  <div className="flex items-center">
                    <span className="px-3 bg-gray-50 border border-r-0 h-10 flex items-center text-gray-500 rounded-l-lg text-sm font-medium">.shop/</span>
                    <Input 
                      id="slug" 
                      placeholder="minimalist-home" 
                      className="rounded-l-none" 
                      value={storeData.slug}
                      onChange={(e) => setStoreData({ ...storeData, slug: e.target.value })}
                    />
                  </div>
                </div>
                <Button 
                  className="w-full h-12 text-lg font-semibold group" 
                  onClick={() => setStep(2)}
                  disabled={!storeData.name || !storeData.slug}
                >
                  Next Step
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-accent">
                <Palette size={40} />
              </div>
              <h1 className="text-3xl font-bold mb-4 tracking-tight">Final details</h1>
              <p className="text-gray-500 mb-10 text-lg">Tell us a bit more to customize your dashboard.</p>
              
              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select 
                    id="industry" 
                    className="w-full h-10 px-3 bg-white border rounded-lg outline-none focus:ring-2 ring-accent/50"
                    value={storeData.industry}
                    onChange={(e) => setStoreData({ ...storeData, industry: e.target.value })}
                  >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Furniture</option>
                    <option value="beauty">Beauty & Health</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Base Currency</Label>
                  <select 
                    id="currency" 
                    className="w-full h-10 px-3 bg-white border rounded-lg outline-none focus:ring-2 ring-accent/50"
                    value={storeData.currency}
                    onChange={(e) => setStoreData({ ...storeData, currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - Dirham</option>
                    <option value="SAR">SAR - Riyal</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="w-1/2 h-12" onClick={() => setStep(1)}>Back</Button>
                  <Button className="w-1/2 h-12" onClick={handleCreateStore} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Store'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-16 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-white shadow-lg shadow-green-200"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <h1 className="text-3xl font-bold mb-4 tracking-tight">Your store is ready!</h1>
              <p className="text-gray-500 mb-8 text-lg">Redirecting you to your professional dashboard...</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 bg-accent rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
