"use client"

import { useEffect, useState } from "react"
import { ITotalMenu, IFavouriteMenu, ITopThree } from "@/app/types"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from "chart.js";
import Image from "next/image"
import lov from "../../../../public/apaya/WhatsApp Image 2025-02-23 at 22.09.12_4787cc51.jpg"

//icon
import { IoFastFoodSharp } from "react-icons/io5";
import { BsBagCheckFill, BsFillCartCheckFill } from "react-icons/bs"
import { RiStackFill } from "react-icons/ri"
import { AlertInfo } from "@/components/alert"


const getTotalMenu = async (): Promise<ITotalMenu[]> => {
    try {
        const TOKEN = getCookie("token");
        const url = `${BASE_API_URL}/menu/total`;
        const { data } = await get(url, TOKEN);

        return data?.status && Array.isArray(data?.total_menu) ? data.total_menu : [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

const getMostOrderedMenu = async (): Promise<IFavouriteMenu[]> => {
    try {
        const TOKEN = getCookie("token");
        const url = `${BASE_API_URL}/menu/most-ordered`;
        const { data } = await get(url, TOKEN);

        return data?.status && Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
        console.error("Failed to fetch most ordered menu:", error);
        return [];
    }
};

const getTopThreeOrderedMenu = async (): Promise<ITopThree[]> => {
    try {
        const TOKEN = getCookie("token");
        const url = `${BASE_API_URL}/menu/top-three-ordered`;
        const { data } = await get(url, TOKEN);

        return data?.status && Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
        console.error("Failed to fetch most ordered menu:", error);
        return [];
    }
};

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);


const DashboardPage = () => {
    const [totalMenu, setTotalMenu] = useState<ITotalMenu[]>([])
    const [mostOrderedMenu, setMostOrderedMenu] = useState<IFavouriteMenu[]>([]);
    const [topThreeOrderedMenu, setTopThreeOrderedMenu] = useState<ITopThree[]>([]);

    useEffect(() => {
        getTotalMenu().then(setTotalMenu);
        getMostOrderedMenu().then(setMostOrderedMenu);
        getTopThreeOrderedMenu().then(setTopThreeOrderedMenu);
    }, []);

    const chartData = {
        labels: mostOrderedMenu.map(item => item.menu.name),
        datasets: [
            {
                label: "Total Orders",
                data: mostOrderedMenu.map(item => item.totalOrdered),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#7DCEA0",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#C9CBFF",
                    "#F1948A",
                    "#85C1E9",
                    "#D2B4DE",
                    "#F7DC6F"
                ],
                borderColor: "#424242",
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                // position: "left" as const, // Geser legend ke kiri
                labels: {
                    color: "white", // Ubah warna teks legend menjadi putih
                    boxWidth: 25, // Atur ukuran kotak warna di legend
                }
            },
            tooltip: {
                enabled: true,
                bodyColor: "white", // Warna teks di dalam tooltip
                titleColor: "white", // Warna judul tooltip
            }
        }
    };


    return (
        <div className="flex flex-col w-full min-h-dvh bg-[#282828] items-center">

            <div className="w-3/4 h-[900px] mt-16 ">
                <div className="w-full h-[10%] flex flex-wrap justify-between overflow-hidden">

                    <div className="w-[23%] border border-gray-400 rounded-lg h-full bg-[#424242] sfprodisplay flex items-center">
                        <div className="border border-teal-400 h-12 rounded-xl bg-[#282828] w-12 flex items-center mx-4 justify-center text-2xl text-white text-opacity-90">
                            <IoFastFoodSharp />
                        </div>
                        <div className="flex flex-col gap-1">
                            {
                                totalMenu.length === 0 ? (
                                    <p className="text-white">No data available</p>
                                ) : (
                                    <div className="font-semibold text-xl text-white">
                                        {totalMenu[0].total} { }
                                    </div>
                                )
                            }
                            <p className="text-white text-opacity-80 text-sm tracking-wide">Total menus</p>
                        </div>
                    </div>



                    <div className="w-[23%] border border-gray-400 rounded-lg h-full bg-[#424242] sfprodisplay flex items-center">
                        <div className="border border-teal-400 h-12 rounded-xl bg-[#282828] w-12 flex items-center mx-4 justify-center text-2xl text-white text-opacity-90">
                            <BsFillCartCheckFill />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-xl text-white">
                                berapa ya
                            </div>
                            <p className="text-white text-opacity-80 text-sm tracking-wide">Total order</p>
                        </div>
                    </div>



                    <div className="w-[23%] border border-gray-400 rounded-lg h-full bg-[#424242] sfprodisplay flex items-center">
                        <div className="border border-teal-400 h-12 rounded-xl bg-[#282828] w-12 flex items-center mx-4 justify-center text-2xl text-white text-opacity-90">
                            <RiStackFill />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-xl text-white">
                                berapa ya
                            </div>
                            <p className="text-white text-opacity-80 text-sm tracking-wide">Order on process</p>
                        </div>
                    </div>




                    <div className="w-[23%] border border-gray-400 rounded-lg h-full bg-[#424242] sfprodisplay flex items-center">
                        <div className="border border-teal-400 h-12 rounded-xl bg-[#282828] w-12 flex items-center mx-4 justify-center text-2xl text-white text-opacity-90">
                            <BsBagCheckFill />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-xl text-white">
                                berapa ya
                            </div>
                            <p className="text-white text-opacity-80 text-sm tracking-wide">Order done</p>
                        </div>
                    </div>

                </div>


                <div className="w-full flex mt-8 justify-between">
                    <div className="border border-gray-400 h-[55dvh] w-1/2 bg-[#424242] rounded-lg">
                        <h2 className="text-white text-lg font-semibold p-4">Favourite Menu</h2>
                        {
                            mostOrderedMenu.length === 0 ? (
                                <p className="text-white text-5xl font-semibold text-center">No data available</p>
                            ) : (
                                <div className="w-full h-full flex justify-center">
                                    <div className="h-4/5 w-[95%]">
                                        <Pie data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <div className="w-[47%] rounded-lg h-[55dvh] bg-[#424242] border border-gray-400 flex flex-col items-center">
                        <h2 className="text-white text-lg font-semibold p-4">Most Favourite Item</h2>
                        {
                            topThreeOrderedMenu.length == 0 ?
                                <AlertInfo title="informasi">
                                    No data Available
                                </AlertInfo>
                                :
                                <>
                                    {topThreeOrderedMenu.map((data, index) => {
                                        return (
                                            <div key={`keyPrestasi${index}`} className="h-[12vh] flex mx-4 mb-6 bg-[#282828] bg-opacity-70 w-10/12 border-l-[3px] border-teal-400 rounded-xl overflow-hidden">
                                                <div className="flex items-center w-60 overflow-hidden rounded-lg">
                                                    <Image src={`${BASE_IMAGE_MENU}/${data.menu.picture}`} alt="" width={70} height={70} className=" h-[12vh] object-cover w-60"></Image>
                                                </div>
                                                <div className="w-[60%] flex flex-col justify-between">
                                                    <div className="pt-2 w-full">
                                                        <p className="flex leading-tight items-center text-white text-opacity-90 pl-6 w-full font-semibold text-base">{data.menu.name}</p>
                                                        <p className="flex leading-tight items-center pl-6 w-full font-semibold text-sm text-teal-400">{data.menu.category}</p>
                                                    </div>

                                                    <p className="flex pb-2 text-white text-opacity-60 items-center pl-2 border-teal-700 border-opacity-80 ml-4 w-[66%] border-t">Total ordered: {data.totalOrdered}</p>
                                                </div>
                                                <p className="w-[26%] flex items-center text-white text-opacity-80 justify-end pr-4 text-sm font-medium">Rp {data.menu.price}</p>
                                            </div>
                                        );
                                    })}

                                </>
                        }

                        {/* <Image src={lov} alt="gatau buat apa" className="h-10/12 cursor-pointer mx-4 w-10/12 object-cover rounded-lg border-l-4 border-teal-400"></Image> */}
                    </div>
                </div>
            </div>

        </div >
    )
}

export default DashboardPage