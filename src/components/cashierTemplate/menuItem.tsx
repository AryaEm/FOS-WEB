import React from 'react';
import Link from "next/link"

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
}

export default function MenuItem({ icon, label, path }: MenuItemProps) {
    return (
        <Link href={path} className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:bg-teal-500 hover:bg-opacity-50 my-2 text-[#b9b9b9] hover:text-white`}>
            <span className="mr-3">{icon}</span>
            <span className="flex-1 text-lg">{label}</span>
        </Link>
    );
}