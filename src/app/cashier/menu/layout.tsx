import UserTemplate from "@/components/cashierTemplate"
import MenuListCashier from "../menuListCashier"
import { CartProvider } from "./cartContext"
import { ToastContainer } from "react-toastify"

export const metadata = {
    title: 'Menu | FOS',
    description: 'Generated by create next app',
}

type PropsLayout = {
    children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <CartProvider>
            <ToastContainer containerId="toastCheckout" />
            <UserTemplate title="Menu" id="menu" menuList={MenuListCashier}>
                {children}
            </UserTemplate>
        </CartProvider>
    )
}
export default RootLayout