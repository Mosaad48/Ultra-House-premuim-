import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  X,
  Send
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { formatPrice, cn } from '../../lib/utils';
import { Product } from '../../types';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isRtl } = useLanguage();
  const { addItem } = useCart();
  const { user, profile } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');
  
  // Review Form State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [realtimeReviews, setRealtimeReviews] = useState<any[]>([]);

  // Fetch product data
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          toast.error('Product not found');
          navigate('/');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Real-time reviews listener
  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'products', id, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRealtimeReviews(reviews);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `products/${id}/reviews`);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId: id,
        userId: user.uid,
        userName: profile?.displayName || 'Anonymous',
        rating: reviewRating,
        comment: reviewComment,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'products', id, 'reviews'), reviewData);
      
      setIsReviewModalOpen(false);
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${id}/reviews`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 animate-pulse">
        <div className="h-4 w-48 bg-gray-100 rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-gray-100 rounded-[32px]" />
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-gray-100 rounded" />
            <div className="h-6 w-1/4 bg-gray-100 rounded" />
            <div className="h-24 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const getStockInfo = () => {
    if (product.stock > 10) {
      return { 
        label: t('product.stock'), 
        color: 'text-green-500 bg-green-50',
        dot: 'bg-green-500'
      };
    }
    if (product.stock > 0) {
      return { 
        label: `${t('product.low')} (${product.stock} left)`, 
        color: 'text-orange-500 bg-orange-50',
        dot: 'bg-orange-500'
      };
    }
    return { 
      label: t('product.out'), 
      color: 'text-red-500 bg-red-50',
      dot: 'bg-red-500'
    };
  };

  const stockInfo = getStockInfo();

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-12">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
        <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
        <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
        <span className="text-black font-medium">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Gallery */}
        <div className="flex flex-col gap-6">
          <div className="aspect-[4/5] overflow-hidden rounded-[32px] bg-gray-100 relative group">
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                src={product.images && product.images[selectedImage] ? product.images[selectedImage] : 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800'} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            <button className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart size={20} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {product.images && product.images.length > 0 && product.images.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300",
                  selectedImage === idx ? "border-black scale-95" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                {product.category}
              </span>
              <div className={cn(
                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors",
                stockInfo.color
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", stockInfo.dot)} />
                {stockInfo.label}
              </div>
            </div>
            
            <h1 className="text-5xl font-display font-black leading-tight mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-400">
                <Star size={18} fill="currentColor" />
                <span className="text-black font-bold text-lg">{product.rating}</span>
                <span className="text-gray-400 font-medium ml-1">({product.reviewsCount} reviews)</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <button className="flex items-center gap-2 text-sm font-bold hover:text-accent transition-colors">
                <Share2 size={16} /> Share Product
              </button>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-display font-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-300 line-through mb-1 font-medium">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <p className="text-accent font-bold text-sm">You save {formatPrice((product.originalPrice || 0) - product.price)} (23% Off)</p>
          </div>

          <div className="space-y-8 mb-12">
            {/* Quantity */}
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">Quantity</label>
              <div className="flex items-center gap-6 bg-gray-50 h-16 w-fit px-6 rounded-2xl border border-gray-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm disabled:opacity-30"
                  disabled={quantity === 1}
                >
                  <Minus size={20} />
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 duration-200"
              >
                <ShoppingBag size={20} /> {t('product.add')}
              </button>
              <button className="flex-1 bg-accent text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95 duration-200">
                {t('product.buy')}
              </button>
            </div>
          </div>

          {/* Delivery Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/50">
              <Truck size={24} className="mb-3 text-gray-400" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Free Delivery Over $500</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/50">
              <RotateCcw size={24} className="mb-3 text-gray-400" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">30-Day Free Returns</p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50/50">
              <ShieldCheck size={24} className="mb-3 text-gray-400" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">2-Year Structural Warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details & Reviews Tabs */}
      <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-16">
        <div className="flex justify-center gap-12 mb-16 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('desc')}
            className={cn(
              "pb-6 text-sm font-bold uppercase tracking-[0.2em] transition-all relative",
              activeTab === 'desc' ? "text-black" : "text-gray-300 hover:text-gray-400"
            )}
          >
            Description
            {activeTab === 'desc' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-black" />}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={cn(
              "pb-6 text-sm font-bold uppercase tracking-[0.2em] transition-all relative",
              activeTab === 'reviews' ? "text-black" : "text-gray-300 hover:text-gray-400"
            )}
          >
            Reviews ({product.reviewsCount})
            {activeTab === 'reviews' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-black" />}
          </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'desc' ? (
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-500 leading-relaxed mb-12">
                {product.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest mb-6">Specifications</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="font-bold text-black">Dimensions</span>
                      <span>210cm W × 95cm D × 80cm H</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="font-bold text-black">Seat Depth</span>
                      <span>65cm</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="font-bold text-black">Materials</span>
                      <span>Oak, Performance Velvet</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="font-bold text-black">Fill</span>
                      <span>High-Density Foam</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest mb-6">Care Instructions</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Vacuum regularly with a soft upholstery attachment. For spills, blot immediately with a clean, damp white cloth. Do not use harsh chemical cleaners or detergents.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-6">
              <div className="flex flex-col md:flex-row gap-16 mb-20">
                <div className="md:w-1/3 text-center">
                  <h3 className="text-7xl font-display font-black mb-2">{product.rating}</h3>
                  <div className="flex justify-center gap-1 text-orange-400 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={20} fill={s <= Math.floor(product.rating) ? "currentColor" : "none"} />)}
                  </div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Based on {product.reviewsCount} reviews</p>
                </div>
                <div className="flex-1 space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-400 w-4">{star}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${star === 5 ? 85 : star === 4 ? 10 : 5}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-8">{star === 5 ? '85%' : star === 4 ? '10%' : '5%'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-12">
                {/* Combined Mock and Real-time reviews */}
                {realtimeReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-50 pb-12">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="font-bold mb-1">{review.userName || review.user}</h5>
                        <div className="flex gap-1 text-orange-400 mb-1">
                          {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() : review.date || 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-500 leading-relaxed">{review.comment}</p>
                    <div className="mt-4 flex gap-4">
                      <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Helpful (0)</button>
                      <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Report</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <button 
                  onClick={() => user ? setIsReviewModalOpen(true) : navigate('/login')}
                  className="bg-white border-2 border-black text-black px-10 py-5 rounded-2xl font-black text-sm hover:bg-black hover:text-white transition-all"
                >
                  WRITE A REVIEW
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-display font-black">Write a Review</h3>
                  <button 
                    onClick={() => setIsReviewModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-8">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={cn(
                            "p-2 rounded-xl transition-all",
                            reviewRating >= star ? "text-orange-400" : "text-gray-200"
                          )}
                        >
                          <Star size={32} fill={reviewRating >= star ? "currentColor" : "none"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">Your Experience</label>
                    <textarea 
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you love about this product?"
                      className="w-full bg-gray-50 border border-gray-100 px-6 py-5 rounded-3xl outline-none focus:bg-white focus:border-black transition-all h-40 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-5 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                  >
                    {isSubmitting ? 'SUBMITTING...' : (
                      <>
                        POST REVIEW <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
