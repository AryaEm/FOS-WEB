"use client"

import { IUser } from "@/app/types"
import { BASE_API_URL } from "../../../../global"
import { put } from "@/lib/api-bridge"
import { getCookies } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { ButtonDanger, ButtonSuccess, ButtonReset } from "@/components/button"
import { InputGroupComponent } from "@/components/InputComponent"
import EditModal from "@/components/Modal"

export default function ResetPassword({ selectedUser }: { selectedUser: IUser }) {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [user, setUser] = useState<IUser>(selectedUser || { password: "" })
    const router = useRouter()
    const TOKEN = getCookies("token") || ""
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (isShow) {
            setUser({ ...user, password: "" }); // Kosongkan password saat modal dibuka
            if (formRef.current) formRef.current.reset();
        }
    }, [isShow]);

    const openModal = () => {
        setUser({ ...selectedUser })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!user.password.trim()) {
            toast("Password cannot be empty", { type: "warning", containerId: "toastUser", hideProgressBar: true });
            return;
        }

        try {
            const url = `${BASE_API_URL}/user/${selectedUser.id}`
            const payload = new FormData()
            payload.append("password", user.password || "")

            const response = await put(url, payload, TOKEN)
            const { data } = response
            
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastUser`, type: `success` })
                setTimeout(() => router.refresh(), 300)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastUser`, type: `warning` })
            }
        } catch (error) {
            console.log(error);
            toast(`Something Wrong`, { hideProgressBar: true, containerId: `toastUser`, type: `error` })
        }
    }

    return (
        <div >
            {/* <ToastContainer containerId={`toastMenu`} /> */}
            <ButtonReset type="button" onClick={() => openModal()}>
                Change Password
            </ButtonReset>

            <EditModal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    {/* modal header */}
                    <div className="sticky px-5 pt-8 pb-4 bg-teal-300">
                        <div className="w-full flex items-center">
                            <strong className="font-bold text-2xl text-white text-opacity-80">Change Password</strong>
                            <div className="ml-auto">
                                <button type="button" className="text-white text-opacity-80" onClick={() => setIsShow(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* end modal header */}


                    {/* modal body */}
                    <div className="px-5 pt-4">
                        <p className="text-[#282828] sfprodisplay tracking-wide font-medium">New Password</p>
                        <InputGroupComponent id={`password`} type="password" value={user.password}
                            onChange={val => setUser({ ...user, password: val })}
                            required={true} label="Password" />

                    </div>
                    {/* end modal body */}


                    {/* modal footer */}
                    <div className="w-full p-5 flex rounded-b-2xl">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                                Cancel
                            </ButtonDanger>
                            <ButtonSuccess type="submit">
                                Save
                            </ButtonSuccess>
                        </div>
                    </div>
                    {/* end modal footer */}
                </form>
            </EditModal>
        </div>
    )

}