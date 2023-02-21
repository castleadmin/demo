import { CreateOrder } from '@castleadmin/checkout-domain';
import { CheckoutApprovalOrder } from './checkout';

export interface CheckoutRequest {
  transactionId: string;
  createOrder: CreateOrder;
}

export interface CheckoutResponse {
  transactionId: string;
  token: string;
  approvalOrder: CheckoutApprovalOrder;
}

export interface ApproveCheckoutRequest {
  transactionId: string;
  token: string;
}

export interface ApproveCheckoutResponse {
  transactionId: string;
}

export interface RejectCheckoutRequest {
  transactionId: string;
  token: string;
}

export interface RejectCheckoutResponse {
  transactionId: string;
}

export interface CheckoutHeartbeatRequest {
  transactionId: string;
  token: string;
}

export interface CheckoutHeartbeatResponse {
  transactionId: string;
}
