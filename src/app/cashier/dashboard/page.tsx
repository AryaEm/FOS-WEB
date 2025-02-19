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

const getMostOrderedMenu = async (): Promise<{ menu: IMenu; totalOrdered: number }[]> => {
    try {
        const TOKEN = await getCookies("token");
        const url = `${BASE_API_URL}/menu/most-ordered`;
        const { data } = await get(url, TOKEN);
        let result: { menu: IMenu; totalOrdered: number }[] = [];
        if (data?.status) result = [...data.data];
        return result;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const DashboardPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams.search ? searchParams.search.toString() : ``
    const menuCategories: IMenuCategory[] = await getMenuCategories();
    const mostOrderedMenu = await getMostOrderedMenu();
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

            <div className="w-3/4 h-[900px] mt-20">
                <div className="bg-cyan-200 w-full lg:h-72 h-52 rounded-xl"></div>

                {
                    menuCategories.length == 0 ?
                        <AlertInfo title="informasi">
                            No data Available
                        </AlertInfo>
                        :
                        <>
                            <div className="w-full flex flex-wrap items-center sfprodisplay">
                                <div className="my-6 w-2/5 h-11 mr-8">
                                    <Search url={`/cashier/dashboard`} search={search} />
                                </div>
                                <div className="flex h-10 cursor-pointer gap-2 rounded mx-2 items-center px-6 w-fit tracking-wide text-white bg-[#323444]">
                                        All
                                </div>

                                {menuCategories.map((data, index) => (

                                    <div key={`keyPrestasi${index}`} className={`flex h-10 cursor-pointer gap-2 rounded mx-2 items-center pl-4 w-36 tracking-wide text-white bg-[#323444]`}>
                                        <div className="h-6 w-6 flex items-center justify-center">
                                            {getCategoryIcon(data.category)}
                                        </div>
                                        {data.category}
                                    </div>
                                ))}

                            </div>
                        </>
                }

                <div className="w-full border-2 border-pink-500 my-6 sfprodisplay">
                    <div className="text-2xl font-semibold text-white text-opacity-80">
                        Favourite Menus
                    </div>

                    {mostOrderedMenu.length === 0 ? (
                        <AlertInfo title="Informasi">No data available</AlertInfo>
                    ) : (
                        <div className="w-full flex flex-wrap gap-6 border-2 border-green-500 my-4">
                            {mostOrderedMenu.map((item, index) => (
                                <div key={`mostOrdered_${index}`} className="flex flex-col w-64 bg-[#323444] text-white p-4 rounded-lg" >
                                    <h3 className="text-lg font-bold">{item.menu.name}</h3>
                                    <Image width={40} height={40} alt="Preview" src={`${BASE_IMAGE_MENU}/${item.menu.picture}`}></Image>
                                    <p className="text-sm opacity-70">{item.menu.category}</p>
                                    <p className="text-md mt-2">Total Ordered: {item.totalOrdered}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>


        </div >
    )
}

export default DashboardPage