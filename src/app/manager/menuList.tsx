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

let MenuList: IPropMenu[] = [
    {
        id: `dashboard`,
        path: `/manager/dashboard`,
        label: `Dashboard`,
        icon: <GoHomeFill className="text-xl" />
    },
    {
        id: `user`,
        path: `/manager/user`,
        label: `User`,
        icon: <FaUserNinja className="text-xl" />
    },
    {
        id: `menu`,
        path: `/manager/menu`,
        label: `Menu`,
        icon: <IoFastFoodSharp className="text-xl" />
    },
    {
        id: `transaksi`,
        path: `/manager/transaksi`,
        label: `Transaksi`,
        icon: <FaHistory className="text-xl" />
    },
]

export default MenuList