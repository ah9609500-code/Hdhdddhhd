import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  User, 
  UserRole, 
  ProductComment, 
  SocialPost, 
  ChatMessage, 
  ProductRequest, 
  Coupon, 
  ActivityLog,
  ProductCategory
} from '../types/pharmacy';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_POSTS, 
  INITIAL_COUPONS, 
  INITIAL_ORDERS 
} from '../data/initialData';

interface PharmacyContextType {
  // Navigation & Role
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  isOnline: boolean;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductPrice: (id: string, newPrice: number, originalPrice?: number) => void;
  updateProductStock: (id: string, newStock: number) => void;
  deleteProduct: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  
  // Favorites & Comparison
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  comparisonList: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Social & Comments
  posts: SocialPost[];
  addPost: (title: string, content: string, category: SocialPost['category'], image?: string) => void;
  likePost: (postId: string) => void;
  comments: ProductComment[];
  addComment: (productId: string, text: string, rating?: number) => void;
  replyToComment: (commentId: string, replyText: string) => void;
  likeComment: (commentId: string) => void;
  reportComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;

  // Unavailable Product Requests
  requests: ProductRequest[];
  createProductRequest: (productName: string, customerName: string, customerPhone: string, notes?: string) => void;
  fulfillProductRequest: (requestId: string) => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discount?: number };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (action: string, details: string) => void;

  // Maintenance & Sync
  resetDatabaseToDefaults: () => void;
  exportDatabaseBackup: () => void;
  importDatabaseBackup: (jsonString: string) => boolean;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

const OWNER_USER: User = {
  id: 'user-owner',
  name: 'د. أحمد الحود (مدير الصيدلية)',
  phone: '07701234500',
  role: 'owner',
  points: 1500,
};

const EMPLOYEE_USER: User = {
  id: 'user-emp',
  name: 'ص. زيد التميمي (صيدلي مناوب)',
  phone: '07702223344',
  role: 'employee',
  points: 400,
};

const CUSTOMER_USER: User = {
  id: 'user-cust',
  name: 'حيدر الكرخي (زبون)',
  phone: '07701234567',
  role: 'customer',
  points: 120,
};

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check URL parameters for developer mode / owner link
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isDevUrl = queryParams?.get('dev') === 'true' || queryParams?.get('mode') === 'developer' || queryParams?.get('role') === 'owner';

  const [activeTab, setActiveTab] = useState<string>(isDevUrl ? 'admin' : 'store');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Online listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Current User & Role
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (isDevUrl) {
      localStorage.setItem('alhoud_user', JSON.stringify(OWNER_USER));
      return OWNER_USER;
    }
    const saved = localStorage.getItem('alhoud_user');
    return saved ? JSON.parse(saved) : OWNER_USER;
  });

  const switchRole = (role: UserRole) => {
    let nextUser = OWNER_USER;
    if (role === 'employee') nextUser = EMPLOYEE_USER;
    if (role === 'customer') nextUser = CUSTOMER_USER;
    setCurrentUser(nextUser);
    localStorage.setItem('alhoud_user', JSON.stringify(nextUser));
    addActivityLog('تبديل الحساب', `تم تسجيل الدخول بصلاحية: ${role === 'owner' ? 'المدير' : role === 'employee' ? 'الموظف' : 'الزبون'}`);
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alhoud_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('alhoud_products', JSON.stringify(products));
  }, [products]);

  // Search & Categories
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Favorites & Comparison
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('alhoud_favorites');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-5'];
  });

  useEffect(() => {
    localStorage.setItem('alhoud_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const addToComparison = (product: Product) => {
    if (comparisonList.length >= 3) {
      alert('يمكن مقارنة 3 منتجات كحد أقصى في نفس الوقت');
      return;
    }
    if (!comparisonList.find(p => p.id === product.id)) {
      setComparisonList(prev => [...prev, product]);
    }
  };
  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
  };
  const clearComparison = () => setComparisonList([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('alhoud_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alhoud_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alhoud_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('alhoud_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'status'>): Order => {
    const newOrderNumber = `HOUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleString('ar-IQ');
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    // Deduct stock
    setProducts(prev => prev.map(prod => {
      const orderedItem = orderData.items.find(i => i.productId === prod.id);
      if (orderedItem) {
        const remainingStock = Math.max(0, prod.stock - orderedItem.quantity);
        return {
          ...prod,
          stock: remainingStock,
          isAvailable: remainingStock > 0
        };
      }
      return prod;
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addActivityLog('طلب جديد', `تم إنشاء طلب جديد برقم ${newOrderNumber} بمبلغ ${orderData.total.toLocaleString()} د.ع بواسطة ${orderData.customerName}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          updatedAt: new Date().toLocaleString('ar-IQ'),
        };
      }
      return ord;
    }));
    addActivityLog('تحديث حالة طلب', `تم تغيير حالة الطلب ${orderId} إلى: ${status}`);
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [newProduct, ...prev]);
    addActivityLog('إضافة منتج', `تمت إضافة منتج جديد: ${prodData.nameAr} بسعر ${prodData.price.toLocaleString()} د.ع`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addActivityLog('تعديل منتج', `تم تعديل بيانات المنتج: ${id}`);
  };

  const updateProductPrice = (id: string, newPrice: number, originalPrice?: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          price: newPrice,
          originalPrice: originalPrice ?? p.price,
        };
      }
      return p;
    }));
    const target = products.find(p => p.id === id);
    addActivityLog('تحديث سعر', `تم تعديل سعر ${target?.nameAr || id} إلى ${newPrice.toLocaleString()} د.ع`);
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          stock: newStock,
          isAvailable: newStock > 0,
        };
      }
      return p;
    }));
    const target = products.find(p => p.id === id);
    addActivityLog('تعديل المخزون', `تم تحديث رصيد ${target?.nameAr || id} إلى ${newStock} وحدة`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addActivityLog('حذف منتج', `تم حذف المنتج: ${target?.nameAr || id}`);
  };

  // Social & Comments
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('alhoud_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('alhoud_posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (title: string, content: string, category: SocialPost['category'], image?: string) => {
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      isOfficialPharmacy: currentUser.role === 'owner',
      title,
      content,
      category,
      likes: 0,
      commentsCount: 0,
      createdAt: 'الآن',
      image,
    };
    setPosts(prev => [newPost, ...prev]);
    addActivityLog('نشر منشور اجتماعي', `تم نشر منشور جديد: ${title}`);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  // Product Comments
  const [comments, setComments] = useState<ProductComment[]>(() => {
    const saved = localStorage.getItem('alhoud_comments');
    return saved ? JSON.parse(saved) : [
      {
        id: 'comm-1',
        productId: 'prod-1',
        userName: 'علي الحسيني',
        userRole: 'customer',
        text: 'دواء أصلي ومفعوله سريع جداً في تسكين الصداع، شكراً لصيدلية الحود على التوصيل السريع.',
        rating: 5,
        createdAt: 'منذ يومين',
        likes: 7,
        pharmacyReply: 'ألف سلامة عليك أخي علي، بخدمتكم دائماً في صيدلية الحود المركزية!'
      },
      {
        id: 'comm-2',
        productId: 'prod-7',
        userName: 'هدى السعدي',
        userRole: 'customer',
        text: 'الغسول ممتاز ومرطب جداً للبشرة الجافة، العبوة أصلية 100%.',
        rating: 5,
        createdAt: 'منذ 3 أيام',
        likes: 12,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('alhoud_comments', JSON.stringify(comments));
  }, [comments]);

  const addComment = (productId: string, text: string, rating = 5) => {
    const newComment: ProductComment = {
      id: `comm-${Date.now()}`,
      productId,
      userName: currentUser.name,
      userRole: currentUser.role,
      text,
      rating,
      createdAt: 'الآن',
      likes: 0,
    };
    setComments(prev => [newComment, ...prev]);
    // update product rating count
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviewsCount: p.reviewsCount + 1 } : p));
  };

  const replyToComment = (commentId: string, replyText: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, pharmacyReply: replyText } : c));
    addActivityLog('رد الصيدلية على تعليق', `تم الرد على التعليق ${commentId}`);
  };

  const likeComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  const reportComment = (commentId: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, isReported: true } : c));
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    addActivityLog('حذف تعليق', `تم حذف تعليق بواسطة الإدارة: ${commentId}`);
  };

  // Product Requests
  const [requests, setRequests] = useState<ProductRequest[]>(() => {
    const saved = localStorage.getItem('alhoud_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'req-1',
        productName: 'بخاخ أوتريفين للبالغين 0.1%',
        genericName: 'Xylometazoline',
        customerName: 'سيف الدين',
        customerPhone: '07718899000',
        requestCount: 6,
        notes: 'مطلوب توفيره بأقرب وقت',
        status: 'pending',
        createdAt: '2026-10-09'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('alhoud_requests', JSON.stringify(requests));
  }, [requests]);

  const createProductRequest = (productName: string, customerName: string, customerPhone: string, notes?: string) => {
    setRequests(prev => {
      const existing = prev.find(r => r.productName.toLowerCase() === productName.toLowerCase());
      if (existing) {
        return prev.map(r => r.id === existing.id ? { ...r, requestCount: r.requestCount + 1, notes: notes || r.notes } : r);
      }
      const newReq: ProductRequest = {
        id: `req-${Date.now()}`,
        productName,
        customerName,
        customerPhone,
        requestCount: 1,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };
      return [newReq, ...prev];
    });
    addActivityLog('طلب منتج غير متوفر', `الزبون ${customerName} طلب توفير: ${productName}`);
  };

  const fulfillProductRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'fulfilled' } : r));
    addActivityLog('تلبية طلب دواء', `تم تحديد طلب الدواء ${requestId} كمكتمل/متوفر`);
  };

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('alhoud_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  useEffect(() => {
    localStorage.setItem('alhoud_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'رمز الكوبون غير صالح أو منتهي الصلاحية' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return { 
        success: false, 
        message: `الحد الأدنى لتطبيق الكوبون هو ${found.minOrderValue.toLocaleString()} د.ع` 
      };
    }
    const discount = Math.min((cartSubtotal * found.discountPercent) / 100, found.maxDiscount);
    setAppliedCoupon(found);
    return { success: true, message: `تم تطبيق الخصم بنجاح (${found.discountPercent}%)`, discount };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons(prev => [newCoupon, ...prev.filter(c => c.code !== newCoupon.code)]);
    addActivityLog('إضافة كوبون', `تم إنشاء كوبون جديد: ${newCoupon.code} بنسبة ${newCoupon.discountPercent}%`);
  };

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('alhoud_chat');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-1',
        senderId: 'user-owner',
        senderName: 'صيدلية الحود المركزية',
        senderRole: 'owner',
        text: 'أهلاً بكم في صيدلية الحود المركزية! نحن جاهزون للإجابة عن أي استفسار دوائي أو تأكيد توفر الوصفات الطبية.',
        timestamp: '10:00 ص',
        isRead: true,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('alhoud_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setChatMessages(prev => [...prev, newMsg]);

    // If sent by customer, simulate pharmacist instant helpful reply
    if (currentUser.role === 'customer') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: 'user-owner',
          senderName: 'صيدلي المناوبة - صيدلية الحود',
          senderRole: 'owner',
          text: 'أهلاً بك! تم استلام رسالتك، الصيدلي يقوم بمراجعتها حالياً للرد عليك فوراً أو تجهيز وصفتك الطبية.',
          timestamp: new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        };
        setChatMessages(prev => [...prev, autoReply]);
      }, 1200);
    }
  };

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('alhoud_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        action: 'تشغيل النظام',
        userName: 'د. أحمد الحود',
        userRole: 'owner',
        details: 'بدء تشغيل تطبيق صيدلية الحود المركزية ومزامنة المخزون',
        timestamp: new Date().toLocaleString('ar-IQ'),
      }
    ];
  });

  const addActivityLog = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      userName: currentUser.name,
      userRole: currentUser.role,
      details,
      timestamp: new Date().toLocaleString('ar-IQ'),
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  useEffect(() => {
    localStorage.setItem('alhoud_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Database Backup & Reset
  const resetDatabaseToDefaults = () => {
    if (confirm('هل أنت متأكد من استعادة بيانات المصنع لصيدلية الحود؟ سيتم مسح التعديلات التجريبية.')) {
      localStorage.removeItem('alhoud_products');
      localStorage.removeItem('alhoud_orders');
      localStorage.removeItem('alhoud_posts');
      localStorage.removeItem('alhoud_comments');
      localStorage.removeItem('alhoud_requests');
      localStorage.removeItem('alhoud_coupons');
      localStorage.removeItem('alhoud_logs');
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setPosts(INITIAL_POSTS);
      setCoupons(INITIAL_COUPONS);
      alert('تمت استعادة البيانات الافتراضية بنجاح!');
    }
  };

  const exportDatabaseBackup = () => {
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      products,
      orders,
      posts,
      comments,
      requests,
      coupons,
      activityLogs
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alhoud_pharmacy_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.products) setProducts(data.products);
      if (data.orders) setOrders(data.orders);
      if (data.posts) setPosts(data.posts);
      if (data.coupons) setCoupons(data.coupons);
      addActivityLog('استيراد نسخة احتياطية', 'تم استيراد قاعدة بيانات كاملة بنجاح');
      return true;
    } catch {
      return false;
    }
  };

  return (
    <PharmacyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        switchRole,
        isOnline,
        products,
        addProduct,
        updateProduct,
        updateProductPrice,
        updateProductStock,
        deleteProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        favorites,
        toggleFavorite,
        comparisonList,
        addToComparison,
        removeFromComparison,
        clearComparison,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        orders,
        createOrder,
        updateOrderStatus,
        posts,
        addPost,
        likePost,
        comments,
        addComment,
        replyToComment,
        likeComment,
        reportComment,
        deleteComment,
        requests,
        createProductRequest,
        fulfillProductRequest,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        chatMessages,
        sendChatMessage,
        activityLogs,
        addActivityLog,
        resetDatabaseToDefaults,
        exportDatabaseBackup,
        importDatabaseBackup,
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
