"use client"

import { useState, useEffect } from "react"
import { IMenuCategory, IMenu } from "@/app/types"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Image from "next/image"
import Search from "@/app/search"
import { useCart } from "./cartContext"
import { useSearchParams } from "next/navigation"

//icon
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";


const getMenu = async (search: string): Promise<IMenu[]> => {
    try {
        const TOKEN = getCookie("token") || ""
        const url = `${BASE_API_URL}/menu?search=${search}`
        const { data } = await get(url, TOKEN)
        let result: IMenu[] = []
        if (data?.status) result = [...data.data]
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

const CashierMenuPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || ""
    // const menu: IMenu[] = await
    const { addToCart } = useCart()
    const { cart } = useCart()
    const [menu, setMenu] = useState<IMenu[]>([]);

    useEffect(() => {
        getMenu(search).then(setMenu);
    }, [search]);

    const handleAddToCart = (item: IMenu) => {
        console.log("Menambahkan ke keranjang:", item);
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            picture: item.picture,
            quantity: 1,
        });
    };

    return (
        <div className="flex flex-col w-full min-h-dvh bg-[#282828] items-center">

            <div className="w-[85%] h-fit mt-6 ">
                <div className="mb-4 w-2/5 h-11 mr-8">
                    <Search url={`/cashier/menu`} search={search} />
                </div>
                {/* <MenuCategory/> */}
            </div>

            <div className="w-full mb-4 mt-12 flex justify-center">
                <div className="w-[60%] ">
                    {
                        menu.length == 0 ?
                            <AlertInfo title="informasi">
                                No data Available
                            </AlertInfo>
                            :
                            <>
                                <div className="w-full flex flex-wrap">
                                    {menu.map((data, index) => (
                                        <div key={`keyPrestasi${index}`} className={`flex flex-col w-[45%] h-[26rem] mr-5 rounded-xl overflow-hidden mb-5 cursor-pointer bg-[#585858]`}>
                                            <div className="w-full overflow-hidden flex rounded ">
                                                <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${data.picture}`} className="w-full h-80 rounded object-cover" alt="preview" unoptimized />
                                            </div>

                                            <div className="w-full h-full sfprodisplay relative">
                                                <div className="text-white text-opacity-60 pl-4 pt-5">
                                                    {data.category}
                                                </div>
                                                <div className="text-white pl-4 text-3xl tracking-wide pb-3 font-semibold">
                                                    {data.name}
                                                </div>
                                                <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-full pl-4 flex justify-between">
                                                    <p className="w-[70%]">{data.description}</p>
                                                    <p className="text-xl pr-4">Rp {data.price}</p>
                                                </div>

                                                <div className="pl-4 relative bottom-0">
                                                    <button
                                                        className="bg-orange-500 text-white px-4 py-2 mt-2 rounded"
                                                        onClick={() => handleAddToCart(data)}
                                                    >
                                                        <FaCirclePlus />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                            </>
                    }
                </div>


                <div className="w-[25%] h-[70dvh] relative ">
                    <div className="fixed w-[25%] h-[90dvh] sfprodisplay bg-[#585858] bg-opacity-60 backdrop:blur-md rounded top-10">
                        <h2 className="text-[#f5f5f5] p-4 font-semibold text-2xl flex flex-col">
                            Order Details
                            <div className="mt-1 w-3/5 h-1 custom-border-color"></div>
                        </h2>

                        {cart.map((item, index) => (
                            <li key={index} className="text-white">
                                {item.name} - {item.quantity} x Rp {item.price}
                            </li>
                        ))}
                    </div>
                </div>
            </div>


        </div >
    )
}

export default CashierMenuPage