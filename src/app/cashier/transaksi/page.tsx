"use client"

import { useState, useEffect } from "react"
import { ITransactionHistory } from "@/app/types"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Image from "next/image"
import Search from "@/app/search"
import { useSearchParams } from "next/navigation"
import { ButtonDetailOrder } from "@/components/button"

//icon
import { PiBowlFoodFill, PiHamburgerFill } from "react-icons/pi";
import { MdEmojiFoodBeverage } from "react-icons/md";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

const getTransactionHistory = async (): Promise<ITransactionHistory[]> => {
    try {
        const TOKEN = getCookie("token") || ""
        const url = `${BASE_API_URL}/order`
        const { data } = await get(url, TOKEN)

        let result: ITransactionHistory[] = []
        if (data?.status && data?.data) result = [...data.data];
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

const TransactionPage = () => {
    const [transactionHistory, setTransactionHistory] = useState<ITransactionHistory[]>([])

    useEffect(() => {
        getTransactionHistory().then(data => {
            console.log("aaa", data); // ✅ Cek apakah 'item' muncul di sini
            setTransactionHistory(data);
        });
    }, []);


    return (
        <div className="flex w-full min-h-dvh bg-[#282828] items-center flex-col">
            <div className="w-3/4 h-fit mt-14">
                <div className="text-white sfprodisplay tracking-wide flex justify-between items-center">
                    <p className="text-2xl text-white font-semibold">Transaction</p>
                    <p className="text-white text-opacity-60">Total Revenue:<span className="text-xl text-white"> Rp 99.999.999,00</span></p>
                </div>

                <div className="mt-6 w-full rounded-b-md rounded-t-2xl overflow-hidden border border-[#5d5d5d]">
                    <div className="bg-[#5d5d5d] flex sfprodisplay font-medium text-white text-opacity-80 tracking-wide h-[5vh] rounded-t-2xl bg-opacity-80">
                        <p className="flex items-center pl-6 w-[15%]">Transaction ID</p>
                        <p className="flex items-center pl-6 w-[35%]">Item</p>
                        <p className="flex items-center pl-6 w-[20%]">Total Price</p>
                        <p className="flex items-center pl-6 w-[15%]">Status</p>
                        <p className="flex items-center pl-6 w-[15%]">Action</p>
                    </div>

                    {
                        transactionHistory.length == 0 ?
                            <AlertInfo title="informasi">
                                No data Available
                            </AlertInfo>
                            :
                            <>
                                {transactionHistory.map((data, index) => {
                                    return (
                                        <div key={`keyPrestasi${index}`} className="bg-[#3d3d3d] items-center bg-opacity-60 border-t border-[#5d5d5d] flex sfprodisplay font-medium text-white tracking-wide h-[7vh]">
                                            <p className="flex items-center pl-6 w-[15%]">{data.id}</p>
                                            <p className="flex items-center pl-6 w-[35%] overflow-y-auto "> {data.orderList.map((orderItem) => orderItem.Item).join(", ")}</p>
                                            <p className="flex items-center pl-6 w-[20%]">{data.total_price}</p>
                                            <p className="flex items-center pl-6 w-[15%]">{data.status}</p>
                                            {/* <p className="flex items-center pl-6 w-[15%]">{data.quantity}</p> */}
                                            <p className="flex items-center pl-6 w-[15%]">
                                                <ButtonDetailOrder type="button">Detail Order</ButtonDetailOrder>
                                            </p>
                                        </div>
                                    );
                                })}

                            </>
                    }

                </div>
            </div>
        </div>
    )
}

export default TransactionPage  