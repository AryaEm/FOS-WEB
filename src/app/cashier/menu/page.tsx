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
import { InputNote } from "@/components/InputComponent"

//icon
// import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { FaRegWindowMinimize } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { FaMinus } from "react-icons/fa6"
import { IoCloseSharp } from "react-icons/io5"


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
    const { cart, updateNote } = useCart()
    const [menu, setMenu] = useState<IMenu[]>([]);
    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loadingCheckout, setLoadingCheckout] = useState(false);


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

    const handleCheckout = async () => {
        if (!customerName || !tableNumber || !paymentMethod) {
            alert("Mohon lengkapi data customer, nomor meja, dan metode pembayaran.");
            return;
        }

        if (cart.length === 0) {
            alert("Keranjang kosong.");
            return;
        }

        try {
            setLoadingCheckout(true);
            const TOKEN = getCookie("token") || "";

            const payload = {
                customer_name: customerName,
                table_number: tableNumber,
                payment_method: paymentMethod,
                total_price: getTotalPrice(),
                items: cart.map((item) => ({
                    menu_id: item.id,
                    quantity: item.quantity,
                    note: item.note || "",
                })),
            };

            const response = await fetch(`${BASE_API_URL}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data?.status) {
                alert("Transaksi berhasil!");
                location.reload(); // Atau bisa reset cart
            } else {
                alert("Gagal melakukan checkout.");
            }
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan.");
        } finally {
            setLoadingCheckout(false);
        }
    };


    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    function DisplayMenu() {
        try {
            let getMenu = [...menu]
            const searchParams = useSearchParams()

            const tag = searchParams.get("tag") || "all"; // Default ke "all"

            if (tag !== "all") {
                getMenu = getMenu.filter((i) => i.category === tag);
            }

            return getMenu.map((data, index) =>
                <div key={`keyPrestasi${index}`} className={`flex flex-col lg:w-[46%] w-full h-[26rem] mr-5 rounded-xl border-b-4 border-teal-400 overflow-hidden mb-5 cursor-pointer bg-[#585858]`}>
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
                            <button className="border-2 border-white text-white text-opacity-70 border-opacity-70 w-11 flex items-center justify-center py-[3px]  mt-2 rounded" onClick={() => handleAddToCart(data)}>
                                <IoIosAdd className="text-2xl" />
                            </button>
                            <button className="border-2 border-white text-white text-opacity-70 border-opacity-70 w-11 flex items-center justify-center py-[3px]  mt-2 rounded" onClick={() => handleRemoveFromCart(data.id)}>
                                <FaMinus className="text-md" />
                            </button>
                        </div>
                    </div>

                </div>
            )
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return (
        <div className="flex flex-col w-full min-h-dvh bg-[#282828] items-center">

            <div className="w-[85%] h-fit mt-6 ">
                <div className="mb-4 w-2/5 h-11 mr-8">
                    <Search url={`/cashier/menu`} search={search} />
                </div>
                <div className="w-1/2">
                    <MenuCategory />
                </div>
            </div>

            <div className="w-full mb-4 mt-12 flex justify-center gap-8 lg:gap-0">
                <div className="lg:w-[60%] w-2/5 ">
                    {
                        menu.length == 0 ?
                            <div className="w-11/12">
                                <AlertInfo title="informasi">
                                    No data Available
                                </AlertInfo>
                            </div>
                            :
                            <>
                                <div className="w-full flex lg:flex-wrap flex-col lg:flex-row">
                                    <DisplayMenu />
                                    {/* {menu.map((data, index) => (
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
                                    ))} */}

                                </div>
                            </>
                    }
                </div>


                <div className="lg:w-[25%] w-[45%] h-[70dvh] relative ">
                    <div className="fixed lg:w-[25%] w-[45%] h-[95dvh] sfprodisplay bg-[#585858] bg-opacity-60 backdrop:blur-md rounded top-5">
                        <h2 className="text-[#f5f5f5] px-4 pt-2 pb-[6px] font-semibold text-xl flex flex-col">
                            Order Details
                            <div className="mt-1 w-3/5 h-[3px] custom-border-color"></div>
                        </h2>

                        <div className="mx-4 mt-0 h-[55%] sfprodisplay overflow-y-auto custom-scrollbar ">
                            {cart.map((item, index) => (
                                <div key={index} className="text-white flex mb-4 mt-4 mr-4 border border-zinc-400 bg-[#6c6c6c] h-28 py-3 px-2 rounded-lg relative">
                                    <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${item.picture}`} className="w-20 h-22 rounded-xl cashier-cart-shadow object-cover" alt="preview" unoptimized />
                                    <div className="flex tracking-wide flex-col pt-1 pl-4 pr-8 h-22 ">
                                        <p className="text-white font-medium text-sm text-opacity-80">{item.name}</p>
                                        <p className="text-lg font-bold">Rp {item.price}</p>

                                        <InputNote
                                            id="keyword"
                                            type="text"
                                            value={item.note || ""}
                                            placeholder="Tambahkan catatan..."
                                            onChange={(value) => updateNote(item.id, value)}
                                            className="mt-2 px-2 p-[0.22rem] rounded text-white w-full border-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center absolute right-4 h-full top-0">
                                        {item.quantity} x
                                    </div>

                                    <div className="h-fit w-fit absolute -top-2 -right-2">
                                        <button className="border-2 bg-white bg-opacity-80 text-red-700 w-6 h-6 flex items-center justify-center rounded-full" onClick={() => handleRemoveFromCart(item.id)}>
                                            <IoCloseSharp className="text-md" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mx-4 mt-4">
                            <form action="" className="space-y-2">
                                <input
                                    type="text"
                                    className="bg-transparent w-full border p-2 rounded text-white outline-none border-[#6c6c6c]"
                                    placeholder="Nama Customer"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="bg-transparent w-full border p-2 rounded text-white outline-none border-[#6c6c6c]"
                                    placeholder="Table Number"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                />
                                <select
                                    className="w-full border p-2 rounded text-white outline-none border-none bg-[#6c6c6c] bg-opacity-50"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="" className="bg-transparent">Metode Pembayaran</option>
                                    <option value="cash" className="bg-transparent">Cash</option>
                                    <option value="qris" className="bg-transparent">Qris</option>
                                </select>
                            </form>
                        </div>

                        <div className="sfprodisplay absolute bottom-0 h-[14dvh] px-5 flex flex-col justify-between w-full ">
                            <div className="tracking-wide font-medium flex justify-between">
                                <p className="text-white text-base text-opacity-80">Total:</p>
                                <p className="text-white text-lg">Rp {getTotalPrice().toLocaleString()}</p>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loadingCheckout}
                                className={`bg-teal-600 text-white h-fit w-full py-2 mb-4 text-center rounded-full font-semibold tracking-wider border border-transparent hover:border-white transition-all duration-300 ${loadingCheckout ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loadingCheckout ? "Processing..." : "Checkout"}
                            </button>

                        </div>
                    </div>
                </div>
            </div>


        </div >
    )
}

export default CashierMenuPage