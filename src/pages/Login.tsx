import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Github, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  BarChart3,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';

export const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    try {
      setLoading(true);
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: 'merchant',
          createdAt: new Date().toISOString()
        });
        toast.success('Account created successfully');
        navigate('/admin/onboarding');
      } else {
        toast.success('Welcome back!');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully');
        navigate('/admin/dashboard');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: email.split('@')[0],
          role: 'merchant',
          createdAt: new Date().toISOString()
        });
        toast.success('Account created successfully');
        navigate('/admin/onboarding');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-black selection:text-white">
      {/* Left Pane: Marketing & Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0a0a] relative overflow-hidden flex-col p-16 justify-between">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-violet-600/20 to-transparent rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/10 to-transparent rounded-full blur-[100px] -ml-48 -mb-48" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white group mb-20 inline-flex">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-black" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter">LUMIÈRE ADMIN</span>
          </Link>

          <div className="max-w-md space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-black text-white leading-tight tracking-tight"
            >
              The power to grow your business.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 font-medium leading-relaxed"
            >
              One platform, millions of merchants worldwide. Manage everything from orders to global marketing in one dashboard.
            </motion.p>

            <ul className="space-y-4">
              {[
                "Global commerce infrastructure",
                "Advanced merchant analytics",
                "Built-in marketing automation",
                "Seamless inventory management"
              ].map((item, i) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center gap-3 text-gray-300 font-bold text-sm"
                >
                  <CheckCircle2 className="text-violet-500" size={18} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Analytics Preview Card */}
        <div className="relative z-10 w-full max-w-lg mt-12 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 p-8 shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Sales</p>
              <h3 className="text-4xl font-black text-white">$124,592.00</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Orders</p>
              <p className="text-xl font-bold text-white">842</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Customers</p>
              <p className="text-xl font-bold text-white">1,204</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Avg Value</p>
              <p className="text-xl font-bold text-white">$148.00</p>
            </div>
          </div>
          
          <div className="mt-8 flex gap-2">
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                className="flex-1 bg-violet-600/50 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 flex items-center justify-between">
           <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">© 2026 LUMIÈRE. ALL RIGHTS RESERVED.</p>
           <div className="flex gap-6">
             <Globe className="text-gray-600" size={16} />
             <span className="text-[10px] font-black text-gray-600 uppercase">English (US)</span>
           </div>
        </div>
      </div>

      {/* Right Pane: Login Form */}
      <div className="flex-1 flex flex-col p-8 md:p-16 lg:p-24 relative overflow-y-auto">
        <div className="lg:hidden mb-12">
           <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white" size={16} />
            </div>
            <span className="text-lg font-black tracking-tighter">LUMIÈRE</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-10">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-header' : 'signup-header'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-4xl font-black tracking-tight mb-3">
                  {isLogin ? 'Welcome back' : 'Create your store'}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {isLogin 
                    ? 'Log in to manage your store, orders, customers, and analytics.' 
                    : 'Start your 14-day free trial. Build your dream storefront in minutes.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-12 font-bold text-sm bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-black transition-all group"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
              Google
            </Button>
            <Button 
              variant="outline" 
              className="h-12 font-bold text-sm bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-black transition-all"
              onClick={() => handleSocialLogin('github')}
              disabled={loading}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <span className="relative bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest block text-center">or continue with email</span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 px-6 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-0 focus:border-black transition-all font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 px-6 pr-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-0 focus:border-black transition-all font-medium"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-1">
              <Checkbox 
                id="remember" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(!!checked)} 
                className="rounded-md border-gray-200"
              />
              <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-black text-white font-black text-sm hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/10 active:translate-y-0 transition-all group"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Log In to Admin' : 'Create My Store'}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm font-bold text-gray-500">
            {isLogin ? "New to Lumière?" : "Already have a store?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-black hover:underline underline-offset-4"
            >
              {isLogin ? 'Create one now' : 'Log in here'}
            </button>
          </p>
        </div>

        <div className="mt-auto pt-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={14} /> Back to storefront
          </Link>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Support'].map(link => (
              <button key={link} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
