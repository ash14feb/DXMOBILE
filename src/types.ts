export interface Customer {
  id: number;
  name: string;
  phone: string;
  rfid: string;
  balance_main: number;
  balance_bonus: number;
}

export interface Card {
  id: number;
  rfid: string;
  name: string;
  balance_main: number;
  balance_bonus: number;
}

export interface AuthData {
  token: string;
  customer: Customer;
  cards: Card[];
}

export interface BillingRecord {
  id: number;
  rfid: string;
  amount: number;
  pre_amount: number;
  post_amount: number;
  log_game: string;
  created_at: string;
  customer_main_amount_used: number;
  customer_bonus_amount_used: number;
  is_refund: 'YES' | 'NO';
  token_earn: number;
}

export interface HistoryResponse {
  records: BillingRecord[];
  total: number;
  limit: number;
  offset: number;
}

export interface RechargePackage {
  id: number;
  name: number;
  recharge_value: number;
  bonus: number;
}

export interface RechargeRecord {
  id: number;
  customer_id: number;
  rfid: string;
  pre_amount: number;
  recharge_amount: number;
  discount_percent_on_bill: number;
  discount_amount_on_bill: number;
  collect_amount_from_customer: number;
  bonus_amount: number;
  main_amount: number;
  post_amount: number;
  created_at: string;
  payment_mode: string;
  gst_amount: number;
  center_code: string;
}

export interface RechargeHistoryResponse {
  records: RechargeRecord[];
  total: number;
  limit: number;
  offset: number;
}
