"use client"

import { IMenuCategory } from "@/app/types"
import { useState, useEffect } from "react"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"

// icon 
import { PiBowlFoodFill, PiHamburgerFill } from "react-icons/pi";
import { MdEmojiFoodBeverage } from "react-icons/md";

const getMenuCategories = async (): Promise<IMenuCategory[]> => {
    try {
        const TOKEN = getCookie("token") || ""
        const url = `${BASE_API_URL}/menu/categories`;
        const { data } = await get(url, TOKEN);

        let result: IMenuCategory[] = [];
        if (data?.status && data?.menu_categories) result = [...data.menu_categories];

        return result;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const MenuCategory = () => {
    // const menuCategories: IMenuCategory[] = getMenuCategories()
    const [category, setCategory] = useState<IMenuCategory[]>([])


    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Food":
                return <PiBowlFoodFill className="text-xl text-white" />;
            case "Drink":
                return <MdEmojiFoodBeverage className="text-xl text-white" />;
            case "Snack":
                return <PiHamburgerFill className="text-xl text-white" />;
            default:
                return null;
        }
    };

    return (
        <>
            {
                category.length == 0 ?
                    <AlertInfo title="informasi">
                        No data Available
                    </AlertInfo>
                    :
                    <>
                        <div className="w-full flex flex-wrap items-center sfprodisplay">

                            <div className="flex h-10 cursor-pointer rounded mr-2 transition-all duration-300 border border-teal-200 px-6 items-center w-fit tracking-wide text-white bg-[#323444]">
                                All
                            </div>

                            {category.map((data, index) => (

                                <div key={`keyPrestasi${index}`} className={`flex h-10 cursor-pointer transition-all duration-300 border border-transparent hover:border-teal-200 gap-2 rounded mr-2 items-center pl-4 w-36 tracking-wide text-white bg-[#323444]`}>
                                    <div className="h-6 w-6 flex items-center justify-center">
                                        {getCategoryIcon(data.category)}
                                    </div>
                                    {data.category}
                                </div>
                            ))}

                        </div>
                    </>
            }
        </>
    )
}

export default MenuCategory