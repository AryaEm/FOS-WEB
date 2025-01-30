import { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import AddMenu from "./addMenu"
// import EditMenu from "./editMenu"
// import DeleteMenu from "./deleteMenu"
import Image from "next/image"
import Search from "./search"

// Icon
// import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineEmojiFoodBeverage } from "react-icons/md";
import { PiBowlFood } from "react-icons/pi";

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

const MenuPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams.search ? searchParams.search.toString() : ``
    const menu: IMenu[] = await getMenu(search)

    const category = (cat: string): React.ReactNode => {
        if (cat === "FOOD") {
            return <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Food
            </span>
        }
        if (cat === "SNACK") {
            return <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                Snack
            </span>
        }
        return <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
            Drink
        </span>
    }



    return (
        <div className="min-h-dvh w-full pt-6 bg-[#FEF5E4]">
            <div className="mx-20 bg-[#F7F4F3] rounded-lg p-3 border-l-4 border-[#5B2333] menu-shadow">
                <h4 className="text-xl font-bold mb-2">Menu Data</h4>
                <p className="text-sm text-secondary mb-4">
                    This page displays menu data, allowing menus to view details,
                    search, and manage menu items by adding, editing, or deleting them.
                </p>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center w-full max-w-md flex-grow">
                        <Search url={`/manager/menu`} search={search} />
                    </div>

                    <div className="ml-4">
                       <AddMenu />
                   </div>
                </div>

                {
                    menu.length == 0 ?
                        <AlertInfo title="informasi">
                            No data Available
                        </AlertInfo>
                        :
                        <>
                            <div className="m-2 flex flex-wrap md: justify-between">
                                {menu.map((data, index) => (
                                    <div key={`keyPrestasi${index}`} className={`group w-[22%] mt-24 my-5 h-[19rem] hover:backdrop-blur-md bg-white border-2 border-[#5B2333] relative rounded-xl cursor-pointer menu-card-shadow`}>
                                        <div className=" transform transition-transform relative">

                                            <div className="absolute h-full w-full flex items-center rounded-xl justify-center bg-transparent group-hover:bg-black group-hover:bg-opacity-10 group-hover:backdrop-blur text-black font-semibold z-10 group-hover:opacity-100 opacity-0 transition-all duration-300">
                                                action
                                            </div>

                                            <div className="relative -top-20 flex flex-col items-center">
                                                <div className="w-44 h-44 transition-opacity duration-300 group-hover:opacity-0">
                                                    <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${data.picture}`} className="rounded-full menu-img-shadow w-full h-full object-cover overflow-hidden" alt="preview" unoptimized />
                                                </div>
                                                <div className="w-full mt-4 text-center sfprodisplay font-medium tracking-wide text-xl">
                                                    {data.name}
                                                </div>
                                                <div className="w-full h-14 sfprodisplay text-center mb-1 text-sm text-black text-opacity-60 p-2">
                                                    {data.description}
                                                </div>
                                                <div className="items-center justify-center w-full">
                                                    <div className="w-full flex items-center justify-center gap-2">
                                                        {data.category === "Food" && (<PiBowlFood className="text-2xl text-opacity-40 text-black" />)}
                                                        {data.category === "Drink" && (<MdOutlineEmojiFoodBeverage className="text-2xl text-black text-opacity-40" />)}
                                                        <p className="text-black text-opacity-40">
                                                            {data.category}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* <div className="w-full md:w-2/12">
                                                <small className="text-sm font-bold text-primary">Action</small><br />
                                                </div> */}
                                            </div>
                                            <div className="w-fit sfprodisplay absolute group-hover:blur-md right-4 bottom-3 flex text-black text-opacity-60 gap-1">
                                                <p className="font-medium text-xl text-end">Rp {data.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                }


            </div>
        </div>
    )
}
export default MenuPage