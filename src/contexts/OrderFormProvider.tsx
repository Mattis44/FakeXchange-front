import { useState, type ReactNode } from "react"
import { OrderFormContext } from "./OrderFormContext";

export const OrderFormProvider = ({ children, base, quote, price }: { children: ReactNode, base: string, quote: string, price: number | undefined }) => {
    const [orderType, setOrderType] = useState<string>("limit");
    const [orderSide, setOrderSide] = useState<string>("buy");
    const [amount, setAmount] = useState<number | undefined>(undefined);
    

    return (
        <OrderFormContext.Provider
            value={{
                orderType,
                setOrderType,
                orderSide,
                setOrderSide,
                amount,
                setAmount,
                price,
                base,
                quote,
            }}
        >
            {children}
        </OrderFormContext.Provider>
    );
}