"use client"

import { useState, useEffect } from "react"
import { ITransactionHistory } from "@/app/types"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL } from "../../../../global"
import { get, put } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Modal from "@/components/Modal"
import Select from "@/components/Select"
import { toast } from "react-toastify"
import { ButtonDetailOrder } from "@/components/button"

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
    const [isShowDetailModal, setIsShowDetailModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<ITransactionHistory | null>(null)
    const [newStatus, setNewStatus] = useState("")

    useEffect(() => {
        getTransactionHistory().then(setTransactionHistory);
    }, []);

    const openDetailModal = (order: ITransactionHistory) => {
        console.log("Buka Modal dengan Order: ", order);
        setSelectedOrder(order);
        setNewStatus(order.status); // set status awal
        setIsShowDetailModal(true);
    }

    const handleUpdateStatus = async () => {
        if (!selectedOrder) return;

        try {
            const TOKEN = getCookie("token") || "";
            const url = `${BASE_API_URL}/order/${selectedOrder.id}`; // pastikan uuid ada
            const payload = { status: newStatus };

            const { data } = await put(url, JSON.stringify(payload), TOKEN)

            if (data?.status) {
                toast(data.message, { hideProgressBar: true, containerId: "toastOrder", type: "success" });
                setIsShowDetailModal(false);
                // Refresh transaksi
                getTransactionHistory().then(setTransactionHistory);
            } else {
                toast(data.message, { hideProgressBar: true, containerId: "toastOrder", type: "warning" });
            }
        } catch (error) {
            console.error(error);
            toast("Something Wrong", { hideProgressBar: true, containerId: "toastOrder", type: "error" });
        }
    }

    return (
        <div className="flex w-full min-h-dvh bg-[#282828] items-center flex-col">
            <div className="w-3/4 h-fit mt-14">
                <div className="text-white sfprodisplay tracking-wide flex justify-between items-center">
                    <p className="text-2xl text-white font-semibold">Transaction</p>
                    <p className="text-white text-opacity-60">Total Revenue:<span className="text-xl text-white"> Rp 99.999.999,00</span></p>
                </div>

                <div className="mt-6 w-full rounded-b-md rounded-t-2xl overflow-hidden border border-[#5d5d5d]">
                    <div className="bg-[#5d5d5d] flex sfprodisplay font-medium text-white text-opacity-80 tracking-wide h-[5vh] rounded-t-2xl bg-opacity-80">
                        <p className="flex items-center pl-6 w-[20%]">Customer Name</p>
                        <p className="flex items-center pl-6 w-[35%]">Item</p>
                        <p className="flex items-center pl-6 w-[15%]">Total Price</p>
                        <p className="flex items-center pl-6 w-[15%]">Status</p>
                        <p className="flex items-center pl-6 w-[15%]">Action</p>
                    </div>

                    {transactionHistory.length == 0 ?
                        <AlertInfo title="informasi">No data Available</AlertInfo> :
                        <>
                            {transactionHistory.map((data, index) => (
                                <div key={index} className="bg-[#3d3d3d] items-center bg-opacity-60 border-t border-[#5d5d5d] flex sfprodisplay font-medium text-white tracking-wide h-[7vh]">
                                    <p className="flex items-center pl-6 w-[20%]">
                                        {data.customer.length > 18 ? data.customer.substring(0, 18) + "..." : data.customer}
                                    </p>
                                    <p className="flex items-center pl-6 w-[35%] overflow-y-auto ">
                                        {data.orderList.length > 3
                                            ? data.orderList.slice(0, 3).map(item => item.Item).join(", ") + "..."
                                            : data.orderList.map(item => item.Item).join(", ")
                                        }
                                    </p>
                                    <p className="flex items-center pl-6 w-[15%]">
                                        IDR {data.total_price.toLocaleString("id-ID")}
                                    </p>
                                    <p className="flex items-center pl-6 w-[15%]">{data.status}</p>
                                    <p className="flex items-center pl-6 w-[15%]">
                                        <ButtonDetailOrder type="button" onClick={() => openDetailModal(data)}>Detail Order</ButtonDetailOrder>
                                    </p>
                                </div>
                            ))}
                        </>
                    }
                </div>
            </div>

            {/* Modal Detail Order */}
            <Modal isShow={isShowDetailModal} onClose={() => setIsShowDetailModal(false)}>
                {selectedOrder && (
                    <>
                          {console.log("Selected Order di Modal: ", selectedOrder)}
                        <div className="p-6 flex flex-col gap-4">
                            <h2 className="text-2xl font-bold">Order Details</h2>
                            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                            <p><strong>Table Number:</strong> {selectedOrder.table_number}</p>
                            <p><strong>Total Price:</strong> Rp {selectedOrder.total_price.toLocaleString("id-ID")}</p>
                            <p><strong>Status:</strong></p>
                            <Select id="status" value={newStatus} onChange={(val) => setNewStatus(val)}>
                                <option value="New">New</option>
                                <option value="Paid">Paid</option>
                                <option value="Done">Done</option>
                            </Select>
                            <div>
                                <p className="font-semibold mb-2">Ordered Items:</p>
                                <ul className="list-disc pl-5">
                                    {selectedOrder.orderList.map((item, idx) => (
                                        <li key={idx}>{item.Item} - {item.quantity} pcs</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsShowDetailModal(false)} className="px-4 py-2 rounded bg-gray-300 text-black font-semibold">Cancel</button>
                                <button type="button" onClick={handleUpdateStatus} className="px-4 py-2 rounded bg-teal-600 text-white font-semibold">Save</button>
                            </div>
                        </div>
                    </>
                )}
            </Modal>

        </div>
    )
}

export default TransactionPage
