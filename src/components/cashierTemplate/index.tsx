"use client"
import { ReactNode } from "react"
import Sidebar from "./sidebar"

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

export default function UserTemplate({ children, id, title, menuList }: ManagerProp) {
    return (
        <div className="w-full min-h-dvh bg-slate-50">
            <Sidebar menuList={menuList} title={title} id={id}>
                {children}
            </Sidebar>
        </div>
    )
}