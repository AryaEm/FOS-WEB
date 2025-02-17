import { ReactNode } from "react"
import { GoHomeFill } from "react-icons/go";
import { FaUserNinja } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";

interface IPropMenu {
    id: string,
    path: string,
    label: string,
    icon: ReactNode
}

let MenuListCashier: IPropMenu[] = [
    {
        id: `dashboard`,
        path: `/cashier/dashboard`,
        label: `Dashboard`,
        icon: <GoHomeFill className="text-xl" />
    },
    {
        id: `menu`,
        path: `/cashier/menu`,
        label: `Menu`,
        icon: <IoFastFoodSharp className="text-xl" />
    },
    {
        id: `transaksi`,
        path: `/cashier/transaksi`,
        label: `Transaksi`,
        icon: <FaHistory className="text-xl" />
    },
]

export default MenuListCashier