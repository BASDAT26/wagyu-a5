export interface Order {
  orderId: string;
  orderDate: Date;
  paymentStatus: string;
  totalAmount: number;
  customerId: string;
}

export interface Promotion {
  promotionId: string;
  promoCode: string;
  discountType: 'NOMINAL' | 'PERCENTAGE';
  discountValue: number;
  startDate: Date | string;
  endDate: Date | string;
  usageLimit: number;
}

export interface OrderPromotion {
  orderPromotionId: string;
  promotionId: string;
  orderId: string;
}
