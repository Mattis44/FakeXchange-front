import { createContext } from "react";

type OrderFormContextType = {
    orderType: string;
    orderSide: string;
    price?: number;
    amount?: number;
    base: string;
    quote: string;

    setOrderType: (type: string) => void;
    setOrderSide: (side: string) => void;
    setAmount: (amount: number) => void;
}

export const OrderFormContext = createContext<OrderFormContextType | null>(null);