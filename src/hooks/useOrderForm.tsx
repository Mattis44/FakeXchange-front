import { useContext } from "react"
import { OrderFormContext } from "../contexts/OrderFormContext"

export const useOrderForm = () => {
    const context = useContext(OrderFormContext);
    if (!context) {
        throw new Error("useOrderForm must be used within an OrderFormProvider");
    }
    return context;
}