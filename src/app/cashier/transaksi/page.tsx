import { IMenu, IMenuCategory } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Image from "next/image"
import Search from "@/app/search"

//icon
import { PiBowlFoodFill, PiHamburgerFill } from "react-icons/pi";
import { MdEmojiFoodBeverage } from "react-icons/md";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";


const getMenuCategories = async (): Promise<IMenuCategory[]> => {
    try {
        const TOKEN = await getCookies("token");
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

const getMenu = async (search: string): Promise<IMenu[]> => {
    try {
        const TOKEN = await getCookies("token")
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

const TransactionPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams.search ? searchParams.search.toString() : ``
    const menuCategories: IMenuCategory[] = await getMenuCategories();
    const menu: IMenu[] = await
        getMenu(search)


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
        <div className="flex w-full min-h-dvh bg-[#282828] items-center flex-col">
            <div className="w-[85%] h-fit mt-6 mb-4">
                <div className="mb-6 w-2/5 h-11 mr-8">
                    <Search url={`/cashier/dashboard`} search={search} />
                </div>

                {
                    menuCategories.length == 0 ?
                        <AlertInfo title="informasi">
                            No data Available
                        </AlertInfo>
                        :
                        <>
                            <div className="w-full flex flex-wrap items-center sfprodisplay">
                                <div className="flex h-10 cursor-pointer rounded mr-4 items-center px-6 w-fit tracking-wide text-white bg-[#323444] border border-transparent hover:border-teal-400 transition-all duration-300">
                                    All
                                </div>

                                {menuCategories.map((data, index) => (

                                    <div key={`keyPrestasi${index}`} className={`flex h-10 cursor-pointer gap-2 rounded mr-4 border border-transparent hover:border-teal-400 transition-all duration-300 items-center pl-4 w-36 tracking-wide text-white bg-[#323444]`}>
                                        <div className="h-6 w-6 flex items-center justify-center">
                                            {getCategoryIcon(data.category)}
                                        </div>
                                        {data.category}
                                    </div>
                                ))}

                            </div>
                        </>
                }

            </div>

            <div className="w-full h-hit flex justify-center">

                <div className="w-[60%] h-fit">
                    {
                        menu.length == 0 ?
                            <AlertInfo title="informasi">
                                No data Available
                            </AlertInfo>
                            :
                            <>
                                <div className="w-full flex flex-wrap ">
                                    {menu.map((data, index) => (
                                        <div key={`keyPrestasi${index}`} className={`flex flex-col w-[30%] h-[25rem] cursor-pointer bg-[#5e606c] mr-5 mb-4 rounded`}>
                                            <div className="h-48 w-full overflow-hidden flex items-end justify-center rounded">
                                                <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${data.picture}`} className="w-full h-48 object-cover rounded" alt="preview" unoptimized />
                                            </div>

                                            <div className="w-full h-full sfprodisplay relative">
                                                <div className="text-white text-opacity-60 pt-4 ml-4 w-full">
                                                    {data.category}
                                                </div>
                                                <div className="w-full text-white text-2xl tracking-wide py-1 font-semibold ml-4">
                                                    {data.name}
                                                </div>
                                                <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-11/12 flex justify-between ml-4">
                                                    <p className="mr-2">{data.description}</p>
                                                </div>
                                                <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-full flex justify-between ml-4">
                                                    <p className="text-xl">Rp {data.price}</p>
                                                </div>
                                            </div>

                                            <div className="border border-blue-500 flex gap-2 px-5 pb-5">
                                                <p className="h-6 w-6 flex items-center justify-center ">
                                                    <FaCirclePlus className=" h-full w-full text-green-500 text-opacity-60"></FaCirclePlus>
                                                </p>

                                                <p>jumlah</p>

                                                <p className="h-6 w-6 flex items-center justify-center">
                                                    <FaCircleMinus className=" h-full w-full text-red-400 text-opacity-60"></FaCircleMinus>
                                                </p>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                            </>
                    }
                </div>


                {/* cart  */}
                <div className="w-[25%] h-[75dvh] relative ">
                    <div className="h-[75dvh] w-[25%] fixed top-40 bg-[#f5f5f5] rounded"></div>
                </div>

            </div>
        </div>
    )
}

export default TransactionPage  