import { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import AddMenu from "./addMenu"
import EditMenu from "./editMenu"
import DeleteMenu from "./deleteMenu"
import Image from "next/image"
import Search from "../../search"

// Icon
// import { IoFastFoodOutline } from "react-icons/io5";
// import { MdEmojiFoodBeverage } from "react-icons/md";
// import { PiBowlFoodFill } from "react-icons/pi";
// import { IoFastFoodSharp } from "react-icons/io5";

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
    const menu: IMenu[] = await
        getMenu(search)

    return (
        <div className="min-h-dvh bg-[#282828] menu-shadow flex justify-center pt-32 pb-10">
            <div className="w-3/4 h-fit">

                <h4 className="text-7xl text-white font-bold mb-2">Menus</h4>
                <p className="text-sm text-secondary my-4 text-white text-opacity-60">
                    This page displays menu data, allowing menus to view details,
                    search, and manage menu items by adding, editing, or deleting them.
                </p>
                <div className="flex items-center my-12 ">
                    <div className="flex w-full max-w-md flex-grow">
                        <Search url={`/manager/menu`} search={search} />
                    </div>

                    <div className="ml-5">
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
                            <div className="w-full flex flex-wrap justify-center gap-12">
                                {menu.map((data, index) => (
                                    <div key={`keyPrestasi${index}`} className={`flex w-full h-80 cursor-pointer`}>
                                        <div className="h-80 w-[45%] bg-[#323444] overflow-hidden flex items-end justify-center rounded-xl border-l-4 border-teal-500">
                                            <Image width={40} height={40} src={`${BASE_IMAGE_MENU}/${data.picture}`} className="w-3/4 h-3/4 rounded object-cover" alt="preview" unoptimized />
                                        </div>

                                        <div className="w-[60%] h-full sfprodisplay relative">
                                            <div className="text-white text-opacity-60 pl-6 pt-10">
                                                {data.category}
                                            </div>
                                            <div className="text-white pl-6 text-3xl tracking-wide py-3 font-semibold">
                                                {data.name}
                                            </div>
                                            <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-full pl-6 flex justify-between">
                                                <p className="w-3/4">{data.description}</p>
                                                <p className="text-xl">Rp {data.price}</p>
                                            </div>
                                            <div className="w-fit pl-6 flex gap-3 absolute bottom-0">
                                                <DeleteMenu selectedMenu={data} />
                                                <EditMenu selectedMenu={data} />
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