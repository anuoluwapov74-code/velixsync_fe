export interface AdminWallet {
  id: number;
  currency: string;
  currency_display: string;
  amount: string;
  wallet_address: string;
  qr_code_url: string | null;
  is_active: boolean;
}

export interface Transaction {
  id: number;
  reference: string;
  transaction_type: string;
  transaction_type_display: string;
  amount: string;
  currency: string;
  unit: string;
  status: string;
  status_display: string;
  created_at: string;
  receipt_url?: string | null;
}

export interface PaymentMethod {
  id: number;
  method_type: string;
  display_name: string;
  address: string;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  account_id: string;
  balance: string;
  formatted_balance: string;
  profit: string;
  formatted_profit: string;
  is_verified: boolean;
}
