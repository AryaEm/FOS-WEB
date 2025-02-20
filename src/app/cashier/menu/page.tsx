"use client"

import { useState, useEffect } from "react"
import { IMenu } from "@/app/types"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Image from "next/image"
import Search from "@/app/search"
import { useCart } from "./cartContext"
import { useSearchParams } from "next/navigation"
import MenuCategory from "./menu-category"

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
    const { removeFromCart } = useCart()
    const { cart } = useCart()
    const [menu, setMenu] = useState<IMenu[]>([]);

    useEffect(() => {
        getMenu(search).then(setMenu);
    }, [search]);


    const handleAddToCart = (item: IMenu) => {
        console.log("Menambahkan ke keranjang:", item);
        addToCart({
            id: item.id,
            uuid: item.uuid,
            name: item.name,
            price: item.price,
            category: item.category,
            picture: item.picture,
            description: item.description,
            quantity: 1,
        });
    };

    const handleRemoveFromCart = (itemId: number) => {
        removeFromCart(itemId); // Panggil fungsi dari useCart
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };


    return (
        <div className="flex flex-col w-full min-h-dvh bg-[#282828] items-center">

            <div className="w-[85%] h-fit mt-6 ">
                <div className="mb-4 w-2/5 h-11 mr-8">
                    <Search url={`/cashier/menu`} search={search} />
                </div>
                {/* <MenuCategory/> */}
            </div>

            <div className="w-full mb-4 mt-12 flex justify-center gap-8 lg:gap-0">
                <div className="lg:w-[60%] w-2/5 ">
                    {
                        menu.length == 0 ?
                            <AlertInfo title="informasi">
                                No data Available
                            </AlertInfo>
                            :
                            <>
                                <div className="w-full flex lg:flex-wrap flex-col lg:flex-row">
                                    {menu.map((data, index) => (
                                        <div key={`keyPrestasi${index}`} className={`flex flex-col lg:w-[46%] w-full h-[26rem] mr-5 rounded-xl overflow-hidden mb-5 cursor-pointer bg-[#585858]`}>
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

                                                <div className="pl-4 mt-2 flex gap-2">
                                                    <button className="bg-teal-400 text-white px-6 py-[6px] mt-2 rounded" onClick={() => handleAddToCart(data)}>
                                                        <FaCirclePlus className="text-2xl" />
                                                    </button>
                                                    <button className="bg-red-400 text-white px-6 py-[6px] mt-2 rounded" onClick={() => handleRemoveFromCart(data.id)}>
                                                        <FaCircleMinus className="text-2xl" />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                            </>
                    }
                </div>


                <div className="lg:w-[25%] w-[45%] h-[70dvh] relative ">
                    <div className="fixed lg:w-[25%] w-[45%] h-[90dvh] sfprodisplay bg-[#585858] bg-opacity-60 backdrop:blur-md rounded top-10">
                        <h2 className="text-[#f5f5f5] p-4 font-semibold text-2xl flex flex-col">
                            Order Details
                            <div className="mt-1 w-3/5 h-1 custom-border-color"></div>
                        </h2>

                        <div className="mx-5 mt-4 h-[68%] sfprodisplay overflow-y-auto custom-scrollbar">
                            {cart.map((item, index) => (
                                <div key={index} className="text-white flex mb-4 mr-4 border border-zinc-400 bg-[#6c6c6c] py-4 px-2 rounded-lg relative">
                                    <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${item.picture}`} className="w-20 h-20 rounded-xl cashier-cart-shadow object-cover" alt="preview" unoptimized />
                                    <div className="flex tracking-wide flex-col justify-center gap-1 pl-4 pr-8">
                                        <p className="text-white font-medium text-lg text-opacity-80">{item.name}</p>
                                        <p className="text-xl font-bold">Rp {item.price}</p>
                                    </div>
                                    <div className="flex items-center absolute right-4 h-full top-0">
                                        {item.quantity} x
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sfprodisplay absolute bottom-0 h-[15dvh] px-5 flex flex-col justify-between w-full ">
                            <div className="tracking-wide font-medium flex justify-between">
                                <p className="text-white text-lg text-opacity-80">Total:</p>
                                <p className="text-white text-xl">Rp {getTotalPrice().toLocaleString()}</p>
                            </div>

                            <div className="bg-teal-600 text-white h-fit w-full py-3 mb-4 text-center rounded-full font-semibold tracking-wider cursor-pointer border border-transparent hover:border-white transition-all duration-300">Chekout</div>
                        </div>
                    </div>
                </div>
            </div>


        </div >
    )
}

export default CashierMenuPage