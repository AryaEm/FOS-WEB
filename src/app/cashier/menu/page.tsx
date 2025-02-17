import { IMenuCategory, IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Image from "next/image"
import Search from "@/app/search"

//icon
import { PiBowlFoodFill, PiHamburgerFill } from "react-icons/pi";
import { MdEmojiFoodBeverage } from "react-icons/md";


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

const CashierMenuPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams.search ? searchParams.search.toString() : ``
    const menuCategories: IMenuCategory[] = await getMenuCategories();
    const menu: IMenu[] = await
        getMenu(search)
    // getMostOrderedMenu(search)

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
        <div className="flex flex-col w-full min-h-dvh bg-[#282828] items-center">

            <div className="w-[85%] h-fit mt-6 ">
                <div className="mb-4 w-2/5 h-11 mr-8">
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

                                <div className="flex h-10 cursor-pointer rounded mr-2 transition-all duration-300 border border-transparent hover:border-teal-200 px-6 items-center w-fit tracking-wide text-white bg-[#323444]">
                                    All
                                </div>

                                {menuCategories.map((data, index) => (

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
            </div>

            <div className="w-full mb-4 mt-12 flex justify-center">
                <div className="w-[60%] border border-red-500">
                    {
                        menu.length == 0 ?
                            <AlertInfo title="informasi">
                                No data Available
                            </AlertInfo>
                            :
                            <>
                                <div className="w-full flex flex-wrap">
                                    {menu.map((data, index) => (
                                        <div key={`keyPrestasi${index}`} className={`flex flex-col w-[45%] h-[25rem] mr-10 rounded mb-4 cursor-pointer bg-[#585858]`}>
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
                                                    <p className="w-3/4">{data.description}</p>
                                                    <p className="text-xl pr-4">Rp {data.price}</p>
                                                </div>
                                            </div>

                                        </div>
                                    ))}

                                </div>
                            </>
                    }
                </div>


                <div className="w-[25%] h-[70dvh] relative">
                    <div className="fixed w-[25%] h-[75dvh] bg-[#f5f5f5] rounded "></div>
                </div>
            </div>


        </div >
    )
}

export default CashierMenuPage