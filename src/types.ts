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
    is_refund: string;
    token_earn: number;
}

export type Screen = 'login' | 'otp' | 'home' | 'transactions' | 'recharges' | 'offers';
