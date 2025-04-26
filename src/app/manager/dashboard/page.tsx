import { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
// import Image from "next/image"
import Search from "@/app/search"


const DashboardPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {

    return (
        <div className="flex w-full h-fit bg-[#282828] justify-center">
            <div className="w-[90%] h-[700px] border-2 mt-28 mb-6">
                <div className="border-4 w-2/4 h-[40dvh] overflow-hidden rounded-2xl"></div>
            </div>
        </div>
    )
}

export default DashboardPage