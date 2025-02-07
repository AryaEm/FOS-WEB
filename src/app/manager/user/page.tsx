import { IUser } from "@/app/types"
import { getCookies } from "@/lib/server-cookie"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "../../../../global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Image from "next/image"
import Search from "@/app/search"
import AddUser from "./addUser"
import EditUser from "./editUser"
import DeleteUser from "./deleteUser"

// Icon
import { MdEmojiFoodBeverage } from "react-icons/md";
import { PiBowlFoodFill } from "react-icons/pi";
import ResetPassword from "./resetPassword"

const getUser = async (search: string): Promise<IUser[]> => {
    try {
        const TOKEN = await getCookies("token")
        const url = `${BASE_API_URL}/user?search=${search}`
        const { data } = await get(url, TOKEN)
        const response = await get(url, TOKEN)
        console.log(response)

        let result: IUser[] = []
        if (data?.status) result = [...data.data]
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

const UserPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = searchParams.search ? searchParams.search.toString() : ``
    const user: IUser[] = await getUser(search)

    return (
        <div className="min-h-dvh bg-[#282828] menu-shadow flex justify-center pt-32 pb-10">
            <div className="w-3/4 h-fit">

                <h4 className="text-7xl font-bold mb-2 text-white">User Management</h4>
                <p className="text-sm text-secondary mb-10 text-white text-opacity-60">
                    This page displays user data, allowing users to view details,
                    search, and manage by adding, editing, or deleting them.
                </p>
                <div className="flex items-center mb-6">
                    <div className="flex items-center w-full max-w-md flex-grow">
                        <Search url={`/manager/user`} search={search} />
                    </div>

                    <div className="ml-5">
                        <AddUser />
                    </div>
                </div>

                {
                    user.length == 0 ?
                        <AlertInfo title="informasi">
                            No data Available
                        </AlertInfo>
                        :
                        <>
                            <div className="w-full flex flex-wrap justify-center gap-3">
                                {user.map((data, index) => (
                                    <div key={`keyPrestasi${index}`} className={`flex bg-[#505050] rounded-lg w-full h-20 sfprodisplay`}>
                                        <div className="w-20 h-full flex items-center justify-center p-px">
                                            <Image width={40} height={40} src={`${BASE_IMAGE_PROFILE}/${data.profile_picture}`} className="rounded-full h-14 w-14 object-cover overflow-hidden" alt="preview" unoptimized />
                                        </div>
                                        <div className="w-[15%] p-2 flex h-full items-center font-semibold sfprodisplay text-white text-opacity-80">
                                            {data.name}
                                        </div>
                                        <div className="w-[20%] flex items-center text-white text-opacity-60">
                                            {data.email}
                                        </div>
                                        <div className="w-[34%] flex items-center text-white text-opacity-60 font-normal tracking-wide">
                                            {data.role}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <ResetPassword selectedUser={data}></ResetPassword>
                                            <EditUser selectedUser={data} />
                                            <DeleteUser selectedUser={data} />
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
export default UserPage