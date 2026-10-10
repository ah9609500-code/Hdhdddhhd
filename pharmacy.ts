/**
 * Data structures and types for Al-Houd Central Pharmacy (صيدلية الحود المركزية)
 */

export type UserRole = 'owner' | 'employee' | 'customer';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  points: number; // Loyalty points
}

export type ProductCategory = 
  | 'medicines' 
  | 'vitamins' 
  | 'skincare' 
  | 'medical_supplies' 
  | 'mother_baby' 
  | 'medical_devices' 
  | 'first_aid';

export interface Product {
  id: string;
  barcode: string;
  nameAr: string;
  nameEn: string;
  genericName: string; // Active ingredient (e.g. Paracetamol)
  category: ProductCategory;
  price: number; // in Iraqi Dinar (IQD)
  originalPrice?: number; // for discount calculations
  costPrice?: number; // for owner gross profit estimation
  stock: number;
  lowStockThreshold: number;
  strength: string; // e.g. 500mg, 10mg/5ml
  dosageForm: string; // أقراص، شراب، مرهم، حقن، كبسول
  manufacturer: string; // e.g. GlaxoSmithKline, Sanofi, SDI Samarra
  expiryDate: string; // YYYY-MM-DD
  batchNumber: string;
  description: string;
  usageInstructions: string;
  safetyWarnings: string;
  isPrescriptionRequired: boolean;
  isAvailable: boolean;
  image: string;
  viewsCount?: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'new' 
  | 'confirmed' 
  | 'preparing' 
  | 'out_for_delivery' 
  | 'completed' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryZone: string;
  deliveryAddress: string;
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash_on_delivery' | 'in_pharmacy';
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductComment {
  id: string;
  productId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  rating?: number;
  createdAt: string;
  likes: number;
  pharmacyReply?: string;
  isReported?: boolean;
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorRole: UserRole;
  isOfficialPharmacy: boolean;
  title: string;
  content: string;
  category: 'tip' | 'announcement' | 'discount' | 'awareness';
  likes: number;
  commentsCount: number;
  createdAt: string;
  image?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ProductRequest {
  id: string;
  productName: string;
  genericName?: string;
  customerName: string;
  customerPhone: string;
  requestCount: number;
  notes?: string;
  status: 'pending' | 'fulfilled' | 'unavailable';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  expiryDate: string;
  isActive: boolean;
  timesUsed: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  userName: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
}
