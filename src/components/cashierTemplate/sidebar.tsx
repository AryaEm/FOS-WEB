"use client"

import { ReactNode, useEffect, useState } from "react"
import Image from "next/image"
import MenuItem from "./menuItem"
import Logo from '../../../public/image/among-us-6044191_960_720.webp'
import Profile from '../../../public/image/mici.jpg'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoLogOut } from "react-icons/io5";
import { getCookie, removeCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { BASE_IMAGE_PROFILE } from "../../../global" // Pastikan BASE_IMAGE_PROFILE sesuai dengan API

type MenuType = {
    id: string,
    icon: ReactNode
    path: string,
    label: string
}
type ManagerProp = {
    children: ReactNode,
    id: string,
    title: string,
    menuList: MenuType[]
}

export default function Sidebar({ children, id, menuList }: ManagerProp) {
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(false)
    const [userData, setUserData] = useState("Name")
    const [userProfil, setUserProfil] = useState("")
    const router = useRouter()

    useEffect(() => {
        setUserData(getCookie("name"))
        setUserProfil(getCookie("profile_picture"))
    }, [])

    // const toggleDropdown = () => {
    //     setIsDropdownOpen(!isDropdownOpen);
    // };

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible)
    }

    const handleLogout = () => {
        removeCookie("token")
        removeCookie("id")
        removeCookie("name")
        removeCookie("role")
        removeCookie("profile_picture")
        removeCookie("cart")
        router.replace(`/login`)
    };

    // const role = getCookies('role')

    return (
        <>
            <div className="top-5 left-6 bg-zinc-700 flex h-12 w-12 items-center justify-center z-[999] rounded-2xl fixed">
                <button onClick={toggleSidebar}>
                    <RxHamburgerMenu className="text-[1.2rem] text-white" />
                </button>
            </div>

            <div className="">
                {children}
            </div>

            {/* 
            <div className={`h-dvh flex items-center absolute top-0 transition-all duration-500 ${isSidebarVisible ? "translate-x-0" : "-translate-x-[21rem"
                }`}> */}
            <div className={`w-80 top-[0.35rem] z-50 h-[98dvh] bg-[#1D2027] fixed bg-opacity-70 backdrop-blur-2xl flex rounded-2xl flex-col transform transition-all duration-500 ${isSidebarVisible ? `translate-x-2` : `-translate-x-[21rem]`
                } `}>
                {/* logo section */}
                <div className="mb-3 w-full flex justify-center py-4">
                    <div className="flex items-center gap-1">
                        <Image src={Logo} alt="Logo" width={40} height={40}
                        />
                        <h1 className="text-2xl font-bold text-[#FDFEFE]">FOS</h1>
                    </div>
                </div>
                {/* end logo section */}


                {/* menu section */}
                <div className="w-full p-2 pt-6 h-full overflow-y-auto ">
                    <div className="px-5">
                        {
                            menuList.map((menu, index) => (
                                <MenuItem icon={menu.icon}
                                    label={menu.label} path={menu.path} active={menu.id === id}
                                    key={`keyMenu${index}`} />
                            ))
                        }
                    </div>
                </div>
                {/* menu section */}


                {/* user section */}
                <div className="w-full bg-primary text-white p-5 py-2 flex gap-2 items-center ">
                    <Image src={`${BASE_IMAGE_PROFILE}/${userProfil}`}
                        alt="Profile" width={40}
                        height={40} className="rounded-full h-10 w-10 object-cover" />
                    <div className="text-sm font-semibold cursor-pointer">
                        {userData}
                    </div>
                </div>
                {/* end user section */}

                {/* logout section */}
                <div className="w-full bg-primary text-white p-5 py-2 flex gap-2 items-center mb-8">
                    <div className="h-10 w-10 flex items-center justify-center">
                        <IoLogOut className="text-xl" />
                    </div>
                    <button className="text-sm font-semibold cursor-pointer" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                {/* end logout section */}

            </div>

            {/* </div> */}




            {/* <h1 className="font-bold text-xl text-white">
                            {title}
                        </h1>
                    </div>

                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex itemscenter space-x-2 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className="size-6">
                                <path strokeLinecap="round"
                                    strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2 .25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                            </svg>
                            <span className="font-bold">Logout</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 top-full">
                                <a href="#" className="block px-4 py-2 text-sm textgray-700 hover:bg-gray-100">Profile</a>
                                <a href="#" className="block px-4 py-2 text-sm textgray-700 hover:bg-gray-100">Settings</a>
                                <a href="#" className="block px-4 py-2 text-sm textgray-700 hover:bg-gray-100">Logout</a>
                            </div>
                        )}
                    </div>
                </header> */}
        </>
    )
}