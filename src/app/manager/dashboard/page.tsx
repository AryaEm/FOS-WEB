import { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
// import Image from "next/image"
import Search from "@/app/search"

const getTotalMenu = async (search: string): Promise<IMenu[]> => {
    try {
        const TOKEN = await getCookies("token")
        const url = `${BASE_API_URL}/menu/total`
        const { data } = await get(url, TOKEN)
        let result: IMenu[] = []
        if (data?.status) result = [...data.data]
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

const DashboardPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams.search ? searchParams.search.toString() : ``
    const totalMenu: IMenu[] = await
        getTotalMenu(search)

    return (
        <div className="flex w-full h-fit bg-[#282828] justify-center">
            <div className="w-[90%] h-[700px] border-2 mt-28 mb-6">

                {
                    totalMenu.length == 0 ?
                        <AlertInfo title="informasi">
                            No data Available
                        </AlertInfo>
                        :
                        <>
                            <div className="w-full flex flex-wrap justify-center gap-12">
                                {totalMenu.map((data, index) => (
                                    <div key={`keyPrestasi${index}`} className={`flex w-full h-80 cursor-pointer`}>
                                        <div className="w-[60%] h-full sfprodisplay relative">
                                            <div className="text-white text-opacity-60 pl-6 pt-10">
                                                {data.name}
                                            </div>
                                            <div className="text-white pl-6 text-3xl tracking-wide py-3 font-semibold">
                                                {data.name}
                                            </div>
                                            <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-full pl-6 flex justify-between">
                                                <p className="w-3/4">{data.description}</p>
                                                <p className="text-xl">Rp {data.price}</p>
                                            </div>
                                            <div className="w-fit pl-6 flex gap-3 absolute bottom-0">
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

export default DashboardPage